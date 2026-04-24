import { ApiError } from '../../api/httpClient';

export const DEFAULT_ADMIN_PAGE_SIZE = 10;

export const getAdminErrorMessage = (error: unknown, fallback: string) =>
  error instanceof ApiError ? error.message : fallback;

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
