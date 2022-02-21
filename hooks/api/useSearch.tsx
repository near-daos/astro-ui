import { useRef, useEffect, MutableRefObject } from 'react';
import { useRequest, Return } from 'hooks/useRequest';

import { SearchParams } from 'services/sputnik/types';
import {
  mapSearchResultsDTOToDataObject,
  SearchResultsDTO,
} from 'services/sputnik/mappers';
import { SearchResultsData } from 'types/search';
import axios, { CancelTokenSource } from 'axios';

export const useSearch = (
  params: SearchParams
): Return<SearchResultsDTO, unknown> & {
  mappedData: SearchResultsData | null;
  cancelToken: MutableRefObject<CancelTokenSource | null>;
} => {
  const axiosSource = useRef<CancelTokenSource | null>(null);

  useEffect(() => {
    axiosSource.current = axios.CancelToken.source();
  }, [params.query]);

  const { data, ...rest } = useRequest<SearchResultsDTO>(
    params.query
      ? {
          url: '/search',
          params: {
            query: params.query,
            accountId: params.accountId,
          },
          cancelToken: axiosSource.current?.token,
        }
      : null
  );

  const mappedData = data
    ? mapSearchResultsDTOToDataObject(params.query, {
        daos: data.daos,
        proposals: data.proposals,
        members: data.members,
      })
    : null;

  return {
    cancelToken: axiosSource,
    mappedData,
    data,
    ...rest,
  };
};
