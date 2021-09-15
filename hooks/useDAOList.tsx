import { SputnikService } from 'services/SputnikService';
import useSWR from 'swr';
import { DAO } from 'types/dao';

const fetcher = () => SputnikService.getDaoList();

type UseDaoListReturn = {
  daos: DAO[];
  isLoading: boolean;
  isError: unknown;
};

export function useDAOList(enabled = true): UseDaoListReturn {
  const { data, error } = useSWR(enabled ? `/daos` : null, fetcher);

  return {
    daos: data || [],
    isLoading: !error && !data,
    isError: error
  };
}
