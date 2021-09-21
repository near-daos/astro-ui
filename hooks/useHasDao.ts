import { useDAOList } from './useDAOList';
import { useSelectedDAO } from './useSelectedDao';

export function useHasDao(): boolean {
  const { isLoading } = useDAOList();
  const selectedDao = useSelectedDAO();

  return !isLoading && !!selectedDao;
}
