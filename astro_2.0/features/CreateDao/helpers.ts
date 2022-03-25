import { configService } from 'services/ConfigService';
import { CreateDaoInput } from 'types/dao';
import { getRolesVotingPolicy } from 'astro_2.0/features/CreateDao/components/DaoSubmitForm/helpers';
import { DEFAULT_CREATE_DAO_GAS } from 'services/sputnik/constants';
import { GlobalState } from 'little-state-machine';
import {
  DAOProposalsType,
  DAOStructureType,
} from 'astro_2.0/features/CreateDao/components/types';

export async function validateDaoAddress(
  value: string | undefined
): Promise<boolean> {
  if (!value) {
    return true;
  }

  const { nearConfig } = configService.get();

  return window.nearService.nearAccountExist(
    `${value}.${nearConfig?.contractName ?? ''}`
  );
}

export function getNewDaoParams(
  data: GlobalState,
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
    amountToTransfer: '5',
    displayName: data.info.displayName,
    policy: {
      ...getRolesVotingPolicy(
        {
          structure: data.proposals.structure as DAOStructureType,
          proposals: data.proposals.proposals as DAOProposalsType,
        },
        window.nearService.getAccountId()
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
