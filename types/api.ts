export type PaginationResponse<T> = {
  total: number;
  data: T;
  nextToken?: string | null;
};
