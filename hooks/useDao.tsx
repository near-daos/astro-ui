import { SputnikService } from 'services/SputnikService';
import useSWR, { SWRConfiguration } from 'swr';
import { DAO } from 'types/dao';

type Options = { enabled: boolean } & SWRConfiguration<DAO | null>;

export function useDao(daoId: string, options?: Options): DAO | null {
  const { enabled = true } = options || {};

  const { data } = useSWR(
    enabled ? ['/daos', daoId] : null,
    (_, id) => SputnikService.getDaoById(id),
    options
  );

  return data ?? null;
}
