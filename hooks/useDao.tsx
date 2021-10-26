import { SputnikHttpService } from 'services/sputnik';
import useSWR, { SWRConfiguration } from 'swr';
import { DAO } from 'types/dao';

type Options = { enabled: boolean } & SWRConfiguration<DAO | null>;

export function useDao(daoId: string, options?: Options): DAO | null {
  const { enabled = true } = options || {};

  const { data } = useSWR(
    enabled ? ['/daos', daoId ?? ''] : null,
    (_, id) => SputnikHttpService.getDaoById(id),
    options
  );

  return data ?? null;
}
