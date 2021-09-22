import { useDAOList } from './useDAOList';
import { useSelectedDAO } from './useSelectedDao';

/*
  @deprecated https://youtu.be/sa9MpLXuLs0
 */
export function useHasDao(): boolean {
  const { isLoading } = useDAOList();
  const selectedDao = useSelectedDAO();

  return !isLoading && !!selectedDao;
}
