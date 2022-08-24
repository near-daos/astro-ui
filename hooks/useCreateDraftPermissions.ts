import { useDaoSettings } from 'context/DaoSettingsContext';
import { DAO } from 'types/dao';
import { useWalletContext } from 'context/WalletContext';

export function useCreateDraftPermissions(dao: Pick<DAO, 'daoMembersList'>): {
  canCreateDrafts: boolean;
} {
  const { accountId } = useWalletContext();
  const { settings } = useDaoSettings();

  const isMember = dao.daoMembersList.includes(accountId);

  return {
    canCreateDrafts:
      isMember || settings?.drafts?.allowCreateDraftByAnyUser || false,
  };
}
