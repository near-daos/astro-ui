import { CancelToken } from 'axios';
import { BaseParams } from './api';

export type SearchParams = {
  query: string;
  cancelToken: CancelToken;
  accountId: string;
} & BaseParams;
