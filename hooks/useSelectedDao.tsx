import { useDao } from 'hooks/useDao';
import { useCallback, useEffect } from 'react';
import { useCookie } from 'react-use';
import { SputnikService } from 'services/SputnikService';
import { DAO } from 'types/dao';

export const DAO_COOKIE = 'selectedDao';

export function useSelectedDAO(): DAO | null {
  const [selectedDaoCookie, setSelectedDaoCookie] = useCookie(DAO_COOKIE);

  const initCookie = useCallback(async () => {
    const [firstDao] = await SputnikService.getDaoList({ limit: 1 });

    setSelectedDaoCookie(firstDao.id, { expires: 30 * 24 * 60 * 60 });
  }, [setSelectedDaoCookie]);

  useEffect(() => {
    if (selectedDaoCookie == null) {
      initCookie();
      // TODO Enable after SSR
      // console.warn(
      //   'Unable to find selected dao cookie. Setting it to the first dao in the list'
      // );
    }
  }, [initCookie, selectedDaoCookie]);

  const currentDao = useDao(selectedDaoCookie || '', {
    enabled: !!selectedDaoCookie
  });

  return currentDao ?? null;
}
