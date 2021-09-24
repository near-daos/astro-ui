export type PaginationResponse<T> = {
  count: number;
  total: number;
  page: number;
  pageCount: number;
  data: T[];
};
