import {
  OpenSearchResponse,
  SearchResponseIndex,
} from 'services/SearchService/types';
import { SearchResultsData } from 'types/search';
import { AxiosResponse } from 'axios';

export function mapIndexToResultKey(index: SearchResponseIndex): string {
  switch (index) {
    case SearchResponseIndex.DAO: {
      return 'daos';
    }
    case SearchResponseIndex.PROPOSAL: {
      return 'proposals';
    }
    case SearchResponseIndex.DRAFT_PROPOSAL: {
      return 'drafts';
    }

    case SearchResponseIndex.COMMENT:
    default: {
      return 'comments';
    }
  }
}

export function isOpenSearchResponse(
  params: SearchResultsData | AxiosResponse<OpenSearchResponse | null> | null
): params is AxiosResponse<OpenSearchResponse | null> {
  return (
    // eslint-disable-next-line no-underscore-dangle
    (params as AxiosResponse<OpenSearchResponse | null>)?.data?._shards !==
    undefined
  );
}
