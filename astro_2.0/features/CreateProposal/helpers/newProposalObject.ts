import { DAO, TGroup } from 'types/dao';
import {
  CreateProposalParams,
  DaoConfig,
  ProposalVariant,
} from 'types/proposal';
import { Tokens } from 'types/token';
import {
  getAddBountyProposal,
  getChangeBondDeadlinesProposal,
  getCompleteBountyProposal,
} from 'astro_2.0/features/CreateProposal/helpers/bountiesHelpers';
import {
  BondsAndDeadlinesData,
  CreateBountyInput,
  CreateTokenInput,
  LinksFormData,
  TokenDistributionInput,
} from 'astro_2.0/features/CreateProposal/types';
import { CreateTransferInput } from 'astro_2.0/features/CreateProposal/components/types';
import { jsonToBase64Str } from 'utils/jsonToBase64Str';
import { DATA_SEPARATOR } from 'constants/common';
import {
  getAddMemberProposal,
  getChangePolicyProposal,
  getRemoveMemberProposal,
  getUpdateGroupProposal,
} from 'features/groups/helpers';
import { IGroupForm } from 'features/groups/types';
import {
  getInitialData,
  getNewProposalObject as getNewVotingPolicyProposalObject,
  VotingPolicyPageInitialData,
} from 'features/vote-policy/helpers';
import Decimal from 'decimal.js';
import { YOKTO_NEAR } from 'services/sputnik/constants';
import { httpService } from 'services/HttpService';
import get from 'lodash/get';
import {
  BuyNftFromMintbaseInput,
  BuyNftFromParasInput,
  CreateRoketoStreamInput,
  CustomFunctionCallInput,
  getAcceptStakingContractProposal,
  getBuyNftFromMintbaseProposal,
  getBuyNftFromParasProposal,
  getChangeConfigProposal,
  getCreateRoketoStreamProposal,
  getChangeVotingPolicyToWeightVoting,
  getCreateTokenProposal,
  getCustomFunctionCallProposal,
  getDeployStakingContractProposal,
  getNewDaoProposal,
  getRemoveUpgradeCodeProposal,
  getSwapsOnRefProposal,
  getTransferDaoFundsProposal,
  getTransferMintbaseNFTProposal,
  getTransferProposal,
  getUpgradeCodeProposal,
  getUpgradeSelfProposal,
  getVoteInOtherDaoProposal,
  SwapsOnRefInput,
  TransferMintbaseNFTInput,
} from 'astro_2.0/features/CreateProposal/helpers/proposalObjectHelpers';
import { getTokenDistributionProposal } from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent/helpers';
import last from 'lodash/last';
import { FunctionCallType } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/types';
import { getNewPermissionsProposalObject } from 'astro_2.0/features/CreateProposal/helpers/permissionsHelpers';
import { SelectorRow } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/helpers';

function getFlagsParamsForMetadata(dao: DAO): {
  flag?: string;
  flagCover?: string;
  flagLogo?: string;
} {
  const flagUrl = dao?.logo?.split('/');
  const flagFileName = last(flagUrl);

  const coverUrl = dao?.flagCover?.split('/');
  const coverFileName = last(coverUrl);

  const logoUrl = dao?.flagLogo?.split('/');
  const logoFileName = last(logoUrl);

  return {
    flag: flagFileName,
    flagCover: coverFileName,
    flagLogo: logoFileName,
  };
}

export async function getNewProposalObject(
  dao: DAO,
  proposalType: ProposalVariant,
  data: Record<string, unknown>,
  tokens: Tokens,
  accountId: string,
  bountyId?: number
): Promise<CreateProposalParams | null> {
  switch (proposalType) {
    case ProposalVariant.ProposeCreateDao: {
      return getNewDaoProposal(dao, data as Record<string, string>);
    }
    case ProposalVariant.ProposeTransferFunds: {
      return getTransferDaoFundsProposal(
        dao,
        data as Record<string, string>,
        tokens
      );
    }
    case ProposalVariant.ProposeGetUpgradeCode: {
      return getUpgradeCodeProposal(dao, data as Record<string, string>);
    }
    case ProposalVariant.ProposeRemoveUpgradeCode: {
      return getRemoveUpgradeCodeProposal(dao, data as Record<string, string>);
    }
    case ProposalVariant.ProposeUpgradeSelf: {
      return getUpgradeSelfProposal(dao, data as Record<string, string>);
    }
    case ProposalVariant.ProposeCreateBounty: {
      return Promise.resolve(
        getAddBountyProposal(dao, data as CreateBountyInput, tokens)
      );
    }
    case ProposalVariant.ProposeTransfer: {
      return getTransferProposal(dao, data as CreateTransferInput, tokens);
    }
    case ProposalVariant.ProposeDoneBounty: {
      const { externalUrl, details } = data;

      return getCompleteBountyProposal(
        dao.id,
        details as string,
        externalUrl as string,
        accountId,
        dao.policy.proposalBond,
        bountyId
      );
    }
    case ProposalVariant.ProposeChangeDaoLinks: {
      const newDaoConfig: DaoConfig = {
        name: dao.name,
        purpose: dao.description,
        metadata: jsonToBase64Str({
          ...getFlagsParamsForMetadata(dao),
          links: (data as unknown as LinksFormData).links
            .map(item => item.url)
            .filter(item => item.length > 0),
          displayName: dao.displayName,
        }),
      };

      return getChangeConfigProposal(
        dao.id,
        newDaoConfig,
        `${data.details}${DATA_SEPARATOR}${data.externalUrl}`,
        dao.policy.proposalBond
      );
    }
    case ProposalVariant.ProposeChangeDaoName: {
      const newDaoConfig: DaoConfig = {
        name: dao.name,
        purpose: dao.description,
        metadata: jsonToBase64Str({
          ...getFlagsParamsForMetadata(dao),
          links: dao.links,
          displayName: data.displayName as string,
        }),
      };

      return getChangeConfigProposal(
        dao.id,
        newDaoConfig,
        `${data.details}${DATA_SEPARATOR}${data.externalUrl}`,
        dao.policy.proposalBond
      );
    }
    case ProposalVariant.ProposeChangeDaoPurpose: {
      const newDaoConfig: DaoConfig = {
        name: dao.name,
        purpose: data.purpose as string,
        metadata: jsonToBase64Str({
          ...getFlagsParamsForMetadata(dao),
          links: dao.links,
          displayName: dao.displayName,
        }),
      };

      return getChangeConfigProposal(
        dao.id,
        newDaoConfig,
        `${data.details}${DATA_SEPARATOR}${data.externalUrl}`,
        dao.policy.proposalBond
      );
    }
    case ProposalVariant.ProposePoll: {
      return {
        daoId: dao.id,
        description: `${data.details}${DATA_SEPARATOR}${data.externalUrl}`,
        kind: 'Vote',
        bond: dao.policy.proposalBond,
      };
    }
    case ProposalVariant.ProposeRemoveMember: {
      return getRemoveMemberProposal(data as unknown as IGroupForm, dao);
    }
    case ProposalVariant.ProposeAddMember: {
      return getAddMemberProposal(data as unknown as IGroupForm, dao);
    }
    case ProposalVariant.ProposeCreateGroup: {
      return getChangePolicyProposal(data as unknown as IGroupForm, dao);
    }
    case ProposalVariant.ProposeUpdateGroup: {
      return getUpdateGroupProposal(
        data.groups as TGroup[],
        data as unknown as IGroupForm,
        dao
      );
    }
    case ProposalVariant.ProposeChangeVotingPolicy: {
      const initialData = getInitialData(dao);

      const newData = {
        daoSettings: {
          details: data.details,
          externalLink: data.externalUrl,
        },
        policy: {
          ...initialData?.policy,
          amount: data.amount,
        },
      };

      return getNewVotingPolicyProposalObject(
        dao,
        newData as VotingPolicyPageInitialData
      );
    }
    case ProposalVariant.ProposeChangeBonds: {
      return getChangeBondDeadlinesProposal(
        dao,
        data as unknown as BondsAndDeadlinesData,
        {
          accountName: '',
          createProposalBond: new Decimal(dao.policy.proposalBond)
            .div(YOKTO_NEAR)
            .toNumber(),
          claimBountyBond: new Decimal(dao.policy.bountyBond)
            .div(YOKTO_NEAR)
            .toNumber(),
          proposalExpireTime: new Decimal(dao.policy.proposalPeriod)
            .div('3.6e12')
            .toNumber(),
          unclaimBountyTime: new Decimal(dao.policy.bountyForgivenessPeriod)
            .div('3.6e12')
            .toNumber(),
        },
        dao.policy.proposalBond,
        `${data.details}${DATA_SEPARATOR}${data.externalUrl}`
      );
    }
    case ProposalVariant.ProposeChangeDaoFlag: {
      const uploadImg = async (img: File) => {
        if (img) {
          const { data: key } = await httpService.post(
            '/api/upload-to-s3',
            img,
            {
              baseURL: '',
            }
          );

          return key;
        }

        return '';
      };

      const flagCover = get(data.flagCover, '0');
      const flagLogo = get(data.flagLogo, '0');

      const [flagCoverFileName, flagLogoFileName] = await Promise.all([
        uploadImg(flagCover),
        uploadImg(flagLogo),
      ]);

      const newDaoConfig: DaoConfig = {
        name: dao.name,
        purpose: dao.description,
        metadata: jsonToBase64Str({
          ...getFlagsParamsForMetadata(dao),
          links: dao.links,
          displayName: dao.displayName,
          flagCover: flagCoverFileName,
          flagLogo: flagLogoFileName,
        }),
      };

      return getChangeConfigProposal(
        dao.id,
        newDaoConfig,
        `${data.details}${DATA_SEPARATOR}${data.externalUrl}`,
        dao.policy.proposalBond
      );
    }
    case ProposalVariant.ProposeChangeDaoLegalInfo: {
      const newDaoConfig: DaoConfig = {
        name: dao.name,
        purpose: dao.description,
        metadata: jsonToBase64Str({
          ...getFlagsParamsForMetadata(dao),
          links: dao.links,
          displayName: dao.displayName,
          legal: {
            legalStatus: data.legalStatus as string,
            legalLink: data.legalLink as string,
          },
        }),
      };

      return getChangeConfigProposal(
        dao.id,
        newDaoConfig,
        `${data.details}${DATA_SEPARATOR}${data.externalUrl}`,
        dao.policy.proposalBond
      );
    }
    case ProposalVariant.ProposeCustomFunctionCall: {
      switch (data.functionCallType) {
        case FunctionCallType.RemoveUpgradeCode: {
          return getRemoveUpgradeCodeProposal(
            dao,
            data as Record<string, string>
          );
        }
        case FunctionCallType.SwapsOnRef: {
          return getSwapsOnRefProposal(dao, data as SwapsOnRefInput);
        }
        case FunctionCallType.VoteInAnotherDao: {
          return getVoteInOtherDaoProposal(dao, data as Record<string, string>);
        }
        case FunctionCallType.BuyNFTfromParas: {
          return getBuyNftFromParasProposal(
            dao,
            data as BuyNftFromParasInput,
            tokens
          );
        }
        case FunctionCallType.BuyNFTfromMintbase: {
          return getBuyNftFromMintbaseProposal(
            dao,
            data as BuyNftFromMintbaseInput,
            tokens
          );
        }
        case FunctionCallType.TransferNFTfromMintbase: {
          return getTransferMintbaseNFTProposal(
            dao,
            data as TransferMintbaseNFTInput
          );
        }
        case FunctionCallType.CreateRoketoStream: {
          return getCreateRoketoStreamProposal(
            dao,
            data as CreateRoketoStreamInput,
            tokens
          );
        }
        default: {
          return getCustomFunctionCallProposal(
            dao,
            data as CustomFunctionCallInput,
            tokens
          );
        }
      }
    }
    case ProposalVariant.ProposeCreateToken: {
      return getCreateTokenProposal(dao, data as unknown as CreateTokenInput);
    }
    case ProposalVariant.ProposeTokenDistribution: {
      return getTokenDistributionProposal(
        dao,
        data as unknown as TokenDistributionInput
      );
    }
    case ProposalVariant.ProposeStakingContractDeployment: {
      return getDeployStakingContractProposal(dao, data);
    }
    case ProposalVariant.ProposeAcceptStakingContract: {
      return getAcceptStakingContractProposal(dao);
    }
    case ProposalVariant.ProposeUpdateVotePolicyToWeightVoting: {
      return getChangeVotingPolicyToWeightVoting(dao, data);
    }
    case ProposalVariant.ProposeChangeProposalVotingPermissions: {
      const initialData = getInitialData(dao);
      const proposedChanges = data.policy as SelectorRow[];

      const newData = {
        daoSettings: {
          details: data.details,
          externalLink: data.externalUrl,
        },
        policy: {
          ...initialData?.policy,
        },
      };

      return getNewPermissionsProposalObject(
        dao,
        newData as VotingPolicyPageInitialData,
        proposedChanges,
        ['VoteApprove', 'VoteReject', 'VoteRemove']
      );
    }
    case ProposalVariant.ProposeChangeProposalCreationPermissions: {
      const initialData = getInitialData(dao);
      const proposedChanges = data.policy as SelectorRow[];

      const newData = {
        daoSettings: {
          details: data.details,
          externalLink: data.externalUrl,
        },
        policy: {
          ...initialData?.policy,
        },
      };

      return getNewPermissionsProposalObject(
        dao,
        newData as VotingPolicyPageInitialData,
        proposedChanges,
        'AddProposal'
      );
    }
    default: {
      return null;
    }
  }
}
