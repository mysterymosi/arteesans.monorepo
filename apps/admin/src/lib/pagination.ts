export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type PaginatedResult<T> = {
  data: T[];
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export function normalizePagination(input: {
  page?: string | number | null;
  pageSize?: string | number | null;
}): PaginationParams {
  const rawPage = Number(input.page ?? 1);
  const rawPageSize = Number(input.pageSize ?? DEFAULT_PAGE_SIZE);
  const pageSize = PAGE_SIZE_OPTIONS.includes(rawPageSize as never)
    ? rawPageSize
    : DEFAULT_PAGE_SIZE;

  return {
    page: Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1,
    pageSize,
  };
}

export function paginationRange({ page, pageSize }: PaginationParams) {
  const from = (page - 1) * pageSize;
  return { from, to: from + pageSize - 1 };
}

export function toPageCount(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / pageSize));
}
