import { configService } from 'services/ConfigService';
import { CreateDaoInput } from 'types/dao';
import { getDetailedRolesVotingPolicy } from 'astro_2.0/features/CreateDao/components/DaoSubmitForm/helpers';
import { DEFAULT_CREATE_DAO_GAS } from 'services/sputnik/constants';
import { GlobalState } from 'little-state-machine';
import { SputnikNearService } from 'services/sputnik';

export async function validateDaoAddress(
  value: string | undefined,
  nearService: SputnikNearService | undefined
): Promise<boolean> {
  if (!nearService) {
    return false;
  }

  if (!value) {
    return true;
  }

  const { nearConfig } = configService.get();

  return nearService?.nearAccountExist(
    `${value}.${nearConfig?.contractName ?? ''}`
  );
}

export function getNewDaoParams(
  data: GlobalState,
  accountId: string,
  cover?: string
): CreateDaoInput {
  return {
    name: data.info.address,
    purpose: data.info.purpose,
    links: data.links.websites as CreateDaoInput['links'],
    flagCover: data.assets.flagCover || cover || '',
    flagLogo: data.assets.flagLogo,
    bond: '0.1',
    votePeriod: '168',
    gracePeriod: '24',
    amountToTransfer: '6',
    displayName: data.info.displayName,
    policy: {
      ...getDetailedRolesVotingPolicy(
        data.proposals,
        data.voting,
        data.members.accounts,
        data.groups.items
      ),
      proposalBond: '0.1',
      proposalPeriod: '168',
      bountyBond: '0.1',
      bountyForgivenessPeriod: '168',
    },
    legal: {
      legalStatus: data.kyc.legalStatus,
      legalLink: data.kyc.legalLink,
    },
    gas: data.submit.gas || DEFAULT_CREATE_DAO_GAS,
  };
}
