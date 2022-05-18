import {
  useCheckDaoUpgrade,
  useUpgradeStatus,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoVersionPageContent/hooks';
import { ProposalType } from 'types/proposal';
import { UserPermissions } from 'types/context';
import { DAO } from 'types/dao';

export function useDaoUpgradeStatus(
  dao: DAO,
  userPermissions: UserPermissions
): {
  isUpgradeAvailable: boolean;
  isUpgradeInProgress: boolean;
} {
  const { version } = useCheckDaoUpgrade(dao);
  const { upgradeStatus } = useUpgradeStatus(dao.id);
  const isUpgradeAvailable =
    !!version &&
    userPermissions.isCanCreateProposals &&
    userPermissions.allowedProposalsToCreate[ProposalType.UpgradeSelf];

  const isUpgradeInProgress =
    upgradeStatus?.upgradeStep !== null &&
    upgradeStatus?.upgradeStep !== undefined;

  return {
    isUpgradeAvailable,
    isUpgradeInProgress,
  };
}
