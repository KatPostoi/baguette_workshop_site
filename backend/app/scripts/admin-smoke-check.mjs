#!/usr/bin/env node

const baseUrl = (process.env.ADMIN_SMOKE_BASE_URL ?? 'http://localhost:6313').replace(
  /\/$/,
  '',
);
const apiBaseUrl = `${baseUrl}/api`;
const credentials = {
  email: process.env.ADMIN_SMOKE_EMAIL ?? 'admin1@baguette.local',
  password: process.env.ADMIN_SMOKE_PASSWORD ?? 'password',
};

let token = '';
const cleanupTasks = [];

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const logStep = (message) => {
  process.stdout.write(`• ${message}\n`);
};

const registerCleanup = (label, task) => {
  cleanupTasks.push({ label, task });
};

const readResponseBody = async (response) => {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  return await response.text();
};

const describePayload = (payload) => {
  if (payload === null || payload === undefined) {
    return 'empty response';
  }

  if (typeof payload === 'string') {
    return payload;
  }

  if (typeof payload === 'object' && 'message' in payload) {
    return String(payload.message);
  }

  return JSON.stringify(payload);
};

const apiRequest = async (
  path,
  { method = 'GET', body, auth = true } = {},
) => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await readResponseBody(response);

  if (!response.ok) {
    throw new Error(
      `${method} ${path} failed with ${response.status}: ${describePayload(payload)}`,
    );
  }

  return payload;
};

const pageRequest = async (path) => {
  const response = await fetch(`${baseUrl}${path}`);
  const payload = await readResponseBody(response);

  if (!response.ok) {
    throw new Error(
      `GET ${path} failed with ${response.status}: ${describePayload(payload)}`,
    );
  }

  assert(
    typeof payload === 'string' && payload.includes('<div id="root">'),
    `GET ${path} did not return the frontend application shell`,
  );
};

const runStep = async (label, task) => {
  process.stdout.write(`→ ${label}... `);
  const result = await task();
  process.stdout.write('ok\n');
  return result;
};

const createUniqueSuffix = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const restoreUser = async (user) => {
  await apiRequest(`/admin/users/${user.id}`, {
    method: 'PATCH',
    body: {
      fullName: user.fullName,
      phone: user.phone,
      gender: user.gender,
      role: user.role,
      isActive: true,
    },
  });
};

const deleteCatalogItem = async (id) => {
  if (id) {
    await apiRequest(`/admin/catalog/${id}`, { method: 'DELETE' });
  }
};

const deleteMaterial = async (id) => {
  if (id !== null) {
    await apiRequest(`/admin/materials/${id}`, { method: 'DELETE' });
  }
};

const deleteStyle = async (id) => {
  if (id) {
    await apiRequest(`/admin/styles/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }
};

const deleteService = async (id) => {
  if (id !== null) {
    await apiRequest(`/admin/services/${id}`, { method: 'DELETE' });
  }
};

const main = async () => {
  const suffix = createUniqueSuffix();

  logStep(`Smoke base URL: ${baseUrl}`);

  await runStep('Frontend shell /admin/orders', () => pageRequest('/admin/orders'));
  await runStep('Frontend shell /admin/data', () => pageRequest('/admin/data'));

  const auth = await runStep('Admin login', () =>
    apiRequest('/auth/login', {
      method: 'POST',
      auth: false,
      body: {
        email: credentials.email,
        password: credentials.password,
      },
    }),
  );

  token = auth.token;
  assert(token, 'Login response did not include JWT token');
  assert(auth.user?.role === 'ADMIN', 'Smoke login user is not an admin');

  const me = await runStep('Admin profile /auth/me', () => apiRequest('/auth/me'));

  const orders = await runStep('Orders list', () => apiRequest('/admin/orders'));
  assert(Array.isArray(orders) && orders.length > 0, 'Admin orders list is empty');

  await runStep('Orders timeline', () =>
    apiRequest(`/admin/orders/${orders[0].id}/timeline`),
  );

  const materials = await runStep('Materials list', () =>
    apiRequest('/admin/materials'),
  );
  const styles = await runStep('Styles list', () => apiRequest('/admin/styles'));
  const services = await runStep('Services list', () =>
    apiRequest('/admin/services'),
  );
  const customers = await runStep('Users tab API', () =>
    apiRequest('/admin/users?role=CUSTOMER&isActive=true'),
  );
  const admins = await runStep('Admins tab API', () =>
    apiRequest('/admin/users?role=ADMIN&isActive=true'),
  );
  const activeTeams = await runStep('Teams tab API', () =>
    apiRequest('/admin/teams?active=true'),
  );

  assert(materials.length > 0, 'Materials seed is empty');
  assert(customers.length > 0, 'No active customers found for smoke');
  assert(admins.length > 1, 'Need at least two active admins for smoke');
  assert(activeTeams.length > 1, 'Need at least two active teams for smoke');

  let createdCatalogId = null;
  let createdMaterialId = null;
  let createdStyleId = null;
  let createdServiceId = null;

  registerCleanup('delete temporary catalog item', () =>
    deleteCatalogItem(createdCatalogId),
  );
  registerCleanup('delete temporary material', () =>
    deleteMaterial(createdMaterialId),
  );
  registerCleanup('delete temporary style', () => deleteStyle(createdStyleId));
  registerCleanup('delete temporary service', () =>
    deleteService(createdServiceId),
  );

  const catalogPayload = {
    slug: `smoke-catalog-${suffix}`,
    title: `Smoke Catalog ${suffix}`,
    description: 'Smoke catalog item for admin regression check.',
    imageUrl: '/smoke/catalog-item.png',
    imageAlt: 'Smoke catalog item',
    materialId: materials[0].id,
    styleId: styles[0]?.id ?? null,
    color: '#c9a77b',
    type: 'DEFAULT',
    widthCm: 30,
    heightCm: 40,
    price: 1500,
    stock: 2,
  };

  const createdCatalog = await runStep('Catalog create', () =>
    apiRequest('/admin/catalog', { method: 'POST', body: catalogPayload }),
  );
  createdCatalogId = createdCatalog.id;

  const updatedCatalog = await runStep('Catalog update', () =>
    apiRequest(`/admin/catalog/${createdCatalog.id}`, {
      method: 'PATCH',
      body: {
        ...catalogPayload,
        title: `${catalogPayload.title} Updated`,
        stock: 3,
      },
    }),
  );
  assert(
    updatedCatalog.title.endsWith('Updated'),
    'Catalog update did not persist',
  );

  await runStep('Catalog delete', () =>
    apiRequest(`/admin/catalog/${createdCatalog.id}`, { method: 'DELETE' }),
  );
  createdCatalogId = null;

  const materialPayload = {
    title: `Smoke Material ${suffix}`,
    material: 'Smoke composite',
    description: 'Smoke material for admin regression check.',
    pricePerCm: 123,
    imageUrl: '/smoke/material.png',
    imageAlt: 'Smoke material',
  };

  const createdMaterial = await runStep('Material create', () =>
    apiRequest('/admin/materials', { method: 'POST', body: materialPayload }),
  );
  createdMaterialId = createdMaterial.id;

  const updatedMaterial = await runStep('Material update', () =>
    apiRequest(`/admin/materials/${createdMaterial.id}`, {
      method: 'PATCH',
      body: {
        ...materialPayload,
        title: `${materialPayload.title} Updated`,
      },
    }),
  );
  assert(
    updatedMaterial.title.endsWith('Updated'),
    'Material update did not persist',
  );

  await runStep('Material delete', () =>
    apiRequest(`/admin/materials/${createdMaterial.id}`, { method: 'DELETE' }),
  );
  createdMaterialId = null;

  const styleId = `smoke-style-${suffix}`;
  const stylePayload = {
    id: styleId,
    name: `Smoke Style ${suffix}`,
    coefficient: 1.23,
  };

  const createdStyle = await runStep('Style create', () =>
    apiRequest('/admin/styles', { method: 'POST', body: stylePayload }),
  );
  createdStyleId = createdStyle.id;

  const updatedStyle = await runStep('Style update', () =>
    apiRequest(`/admin/styles/${encodeURIComponent(styleId)}`, {
      method: 'PATCH',
      body: {
        name: `${stylePayload.name} Updated`,
        coefficient: 1.4,
      },
    }),
  );
  assert(
    updatedStyle.name.endsWith('Updated'),
    'Style update did not persist',
  );

  await runStep('Style delete', () =>
    apiRequest(`/admin/styles/${encodeURIComponent(styleId)}`, {
      method: 'DELETE',
    }),
  );
  createdStyleId = null;

  const nextServiceId =
    Math.max(1000, ...services.map((service) => service.id)) + 1;
  const servicePayload = {
    id: nextServiceId,
    type: 'smoke',
    title: `Smoke Service ${suffix}`,
    price: 777,
  };

  const createdService = await runStep('Service create', () =>
    apiRequest('/admin/services', { method: 'POST', body: servicePayload }),
  );
  createdServiceId = createdService.id;

  const updatedService = await runStep('Service update', () =>
    apiRequest(`/admin/services/${createdService.id}`, {
      method: 'PATCH',
      body: {
        type: servicePayload.type,
        title: `${servicePayload.title} Updated`,
        price: 888,
      },
    }),
  );
  assert(
    updatedService.title.endsWith('Updated'),
    'Service update did not persist',
  );

  await runStep('Service delete', () =>
    apiRequest(`/admin/services/${createdService.id}`, { method: 'DELETE' }),
  );
  createdServiceId = null;

  const customer = customers.find((user) => user.id !== me.id && user.isActive);
  assert(customer, 'No active customer available for lifecycle smoke');

  registerCleanup('restore customer state', () => restoreUser(customer));

  await runStep('Customer update', () =>
    apiRequest(`/admin/users/${customer.id}`, {
      method: 'PATCH',
      body: {
        fullName: `${customer.fullName} Smoke`,
        phone: customer.phone,
        gender: customer.gender,
        role: customer.role,
        isActive: true,
      },
    }),
  );

  await runStep('Customer deactivate', () =>
    apiRequest(`/admin/users/${customer.id}`, { method: 'DELETE' }),
  );

  const inactiveCustomers = await runStep('Customer inactive filter', () =>
    apiRequest(
      `/admin/users?role=CUSTOMER&isActive=false&search=${encodeURIComponent(customer.email)}`,
    ),
  );
  assert(
    inactiveCustomers.some((user) => user.id === customer.id),
    'Customer did not appear in inactive filter after deactivate',
  );

  await runStep('Customer restore', () => restoreUser(customer));

  const admin = admins.find((user) => user.id !== me.id && user.isActive);
  assert(admin, 'No secondary active admin available for lifecycle smoke');

  registerCleanup('restore admin state', () => restoreUser(admin));

  await runStep('Admin update', () =>
    apiRequest(`/admin/users/${admin.id}`, {
      method: 'PATCH',
      body: {
        fullName: `${admin.fullName} Smoke`,
        phone: admin.phone,
        gender: admin.gender,
        role: admin.role,
        isActive: true,
      },
    }),
  );

  await runStep('Admin deactivate', () =>
    apiRequest(`/admin/users/${admin.id}`, { method: 'DELETE' }),
  );

  const inactiveAdmins = await runStep('Admin inactive filter', () =>
    apiRequest(
      `/admin/users?role=ADMIN&isActive=false&search=${encodeURIComponent(admin.email)}`,
    ),
  );
  assert(
    inactiveAdmins.some((user) => user.id === admin.id),
    'Admin did not appear in inactive filter after deactivate',
  );

  await runStep('Admin restore', () => restoreUser(admin));

  const orderToReassign = orders.find((order) => order.team?.id);
  assert(orderToReassign, 'No order with assigned team found for team smoke');

  const originalTeamId = orderToReassign.team.id;
  const smokeTeam = activeTeams.find((team) => team.id !== originalTeamId);
  assert(smokeTeam, 'Could not find secondary active team for smoke');

  registerCleanup('restore order team assignment', () =>
    apiRequest(`/admin/orders/${orderToReassign.id}/team`, {
      method: 'PATCH',
      body: { teamId: originalTeamId },
    }),
  );
  registerCleanup('restore team active state', () =>
    apiRequest(`/admin/teams/${smokeTeam.id}`, {
      method: 'PATCH',
      body: { name: smokeTeam.name, active: true },
    }),
  );

  const updatedSmokeTeam = await runStep('Team update', () =>
    apiRequest(`/admin/teams/${smokeTeam.id}`, {
      method: 'PATCH',
      body: {
        name: `${smokeTeam.name} Smoke`,
        active: true,
      },
    }),
  );

  await runStep('Assign updated team to order', () =>
    apiRequest(`/admin/orders/${orderToReassign.id}/team`, {
      method: 'PATCH',
      body: { teamId: updatedSmokeTeam.id },
    }),
  );

  await runStep('Team deactivate', () =>
    apiRequest(`/admin/teams/${updatedSmokeTeam.id}`, { method: 'DELETE' }),
  );

  const ordersAfterDeactivate = await runStep(
    'Orders keep inactive team in assigned order',
    () => apiRequest('/admin/orders'),
  );
  const reassignedOrder = ordersAfterDeactivate.find(
    (order) => order.id === orderToReassign.id,
  );
  assert(
    reassignedOrder?.team?.id === updatedSmokeTeam.id,
    'Order lost inactive team reference after deactivation',
  );

  const inactiveTeams = await runStep('Inactive teams filter', () =>
    apiRequest(
      `/admin/teams?active=false&search=${encodeURIComponent(updatedSmokeTeam.name)}`,
    ),
  );
  assert(
    inactiveTeams.some((team) => team.id === updatedSmokeTeam.id),
    'Team did not appear in inactive filter after deactivate',
  );

  await runStep('Restore original order/team state', async () => {
    await apiRequest(`/admin/orders/${orderToReassign.id}/team`, {
      method: 'PATCH',
      body: { teamId: originalTeamId },
    });
    await apiRequest(`/admin/teams/${updatedSmokeTeam.id}`, {
      method: 'PATCH',
      body: { name: smokeTeam.name, active: true },
    });
  });

  logStep('Admin smoke checks passed');
};

const runCleanup = async () => {
  for (const { label, task } of cleanupTasks.reverse()) {
    try {
      await task();
    } catch (error) {
      process.stderr.write(
        `cleanup failed: ${label}: ${error instanceof Error ? error.message : String(error)}\n`,
      );
    }
  }
};

try {
  await main();
} catch (error) {
  process.stderr.write(
    `admin smoke failed: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  await runCleanup();
  process.exitCode = 1;
}
