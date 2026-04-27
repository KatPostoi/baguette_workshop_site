import { ApiError } from '../../api/httpClient';

export const DEFAULT_ADMIN_PAGE_SIZE = 10;

export const getAdminErrorMessage = (error: unknown, fallback: string) =>
  error instanceof ApiError ? error.message : fallback;

export const normalizeAdminFilterValue = (
  value: string | number | null | undefined,
) => String(value ?? '').trim();

export const matchesAdminSelectValue = (
  selectedValue: string,
  actualValue: string | number | null | undefined,
) => {
  const normalizedSelectedValue = normalizeAdminFilterValue(selectedValue);

  if (!normalizedSelectedValue) {
    return true;
  }

  return (
    normalizeAdminFilterValue(actualValue).toLowerCase() ===
    normalizedSelectedValue.toLowerCase()
  );
};

export const buildAdminSelectOptions = <TItem>(
  items: TItem[],
  getValue: (item: TItem) => string | number | null | undefined,
) =>
  Array.from(
    new Set(
      items
        .map((item) => normalizeAdminFilterValue(getValue(item)))
        .filter(Boolean),
    ),
  ).sort((left, right) =>
    left.localeCompare(right, 'ru', {
      numeric: true,
      sensitivity: 'base',
    }),
  );

export const matchesAdminSearch = (
  search: string,
  ...parts: Array<string | number | null | undefined>
) => {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return parts.some((part) =>
    String(part ?? '')
      .toLowerCase()
      .includes(normalizedSearch),
  );
};
