/* istanbul ignore file */
// TODO refactor the helper. It's too big now.

import * as yup from 'yup';
import { AnySchema } from 'yup';
import uniq from 'lodash/uniq';
import { nanoid } from 'nanoid';
import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';
import { TFunction } from 'react-i18next';

// Types
import { ProposalType, ProposalVariant } from 'types/proposal';
import { DAO, DaoDelegation, Member } from 'types/dao';
import { MemberStats } from 'services/sputnik/mappers';
import { Option } from 'astro_2.0/features/CreateProposal/components/GroupedSelect';
import { FunctionCallType } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/types';

// Constants
import {
  VALID_METHOD_NAME_REGEXP,
  VALID_URL_REGEXP,
  VALID_WEBSITE_NAME_REGEXP,
} from 'constants/regexp';
import { MAX_GAS, MIN_GAS } from 'services/sputnik/constants';

// Components
import { TransferContent } from 'astro_2.0/features/CreateProposal/components/TransferContent';
import { AddBountyContent } from 'astro_2.0/features/CreateProposal/components/AddBountyContent';
import { BountyDoneContent } from 'astro_2.0/features/CreateProposal/components/DoneBountyContent';
import { ChangeLinksContent } from 'astro_2.0/features/CreateProposal/components/ChangeLinksContent';
import { CreateGroupContent } from 'astro_2.0/features/CreateProposal/components/CreateGroupContent';
import { ChangeBondsContent } from 'astro_2.0/features/CreateProposal/components/ChangeBondsContent';
import { ChangePolicyContent } from 'astro_2.0/features/CreateProposal/components/ChangePolicyContent';
import { ChangeDaoNameContent } from 'astro_2.0/features/CreateProposal/components/ChangeDaoNameContent';
import { ChangeDaoFlagContent } from 'astro_2.0/features/CreateProposal/components/ChangeDaoFlagContent';
import { ChangeDaoPurposeContent } from 'astro_2.0/features/CreateProposal/components/ChangeDaoPurposeContent';
import { AddMemberToGroupContent } from 'astro_2.0/features/CreateProposal/components/AddMemberToGroupContent';
import { ChangeDaoLegalInfoContent } from 'astro_2.0/features/CreateProposal/components/ChangeDaoLegalInfoContent';
import { RemoveMemberFromGroupContent } from 'astro_2.0/features/CreateProposal/components/RemoveMemberFromGroupContent';
import { TokenDistributionContent } from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent';
import { DeployStakingContractContent } from 'astro_2.0/features/CreateProposal/components/DeployStakingContractContent';
import { UpdateVotePolicyToWeightVoting } from 'astro_2.0/features/CreateProposal/components/UpdateVotePolicyToWeightVoting';
import { CreateDaoContent } from 'astro_2.0/features/CreateProposal/components/CreateDaoContent';
import { ChangeVotingPermissionsContent } from 'astro_2.0/features/CreateProposal/components/ChangeVotingPermissionsContent';
import { CreateTokenContent } from 'astro_2.0/features/CreateProposal/components/CreateTokenContent';
import { UpdateGroupContent } from 'astro_2.0/features/CreateProposal/components/UpdateGroupContent';
import { AcceptStakingContractContent } from 'astro_2.0/features/CreateProposal/components/AcceptStakingContractContent';

// Helpers & Utils
import { getInitialData } from 'features/vote-policy/helpers';

import {
  getImgValidationError,
  requiredImg,
  validateImgSize,
} from 'utils/imageValidators';
import { SputnikNearService } from 'services/sputnik';
import { ProposalPermissions } from 'types/context';
import { TransferFundsContent } from 'astro_2.0/features/CreateProposal/components/TransferFundsContent';
import { Token } from 'types/token';
import Decimal from 'decimal.js';

const CustomFunctionCallContent = dynamic(
  import(
    'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent'
  ),
  {
    ssr: false,
  }
);

export function getProposalTypesOptions(
  t: TFunction,
  isCanCreatePolicyProposals: boolean,
  allowedProposalsToCreate: ProposalPermissions,
  canCreateTokenProposal = false
): {
  title: string;
  options: Option[];
  disabled: boolean;
}[] {
  const getTitle = (key: string) => t(`createProposal.header.${key}`);
  const getLabel = (key: string) => t(`proposalCard.proposalTypes.${key}`);

  const changeConfigTitle = getLabel('groupChangeConfig');

  const config = [
    {
      title: getLabel('groupTransferAddBounty'),
      disabled:
        !allowedProposalsToCreate[ProposalType.Transfer] &&
        !allowedProposalsToCreate[ProposalType.AddBounty],
      options: [
        {
          label: getLabel('proposeTransfer'),
          value: ProposalVariant.ProposeTransfer,
          group: getLabel('groupTransferAddBounty'),
          disabled: !allowedProposalsToCreate[ProposalType.Transfer],
        },
        {
          label: getLabel('proposeBounty'),
          value: ProposalVariant.ProposeCreateBounty,
          group: getLabel('groupTransferAddBounty'),
          disabled: !allowedProposalsToCreate[ProposalType.AddBounty],
        },
      ],
    },
    {
      title: changeConfigTitle,
      disabled:
        !isCanCreatePolicyProposals ||
        !allowedProposalsToCreate[ProposalType.ChangeConfig],
      options: [
        {
          label: getLabel('proposeDAOName'),
          value: ProposalVariant.ProposeChangeDaoName,
          group: getLabel('groupChangeConfig'),
        },
        {
          label: getLabel('proposeDAOPurpose'),
          value: ProposalVariant.ProposeChangeDaoPurpose,
          group: getLabel('groupChangeConfig'),
        },
        {
          label: getLabel('proposeDAOLinks'),
          value: ProposalVariant.ProposeChangeDaoLinks,
          group: getLabel('groupChangeConfig'),
        },
        {
          label: getLabel('proposeDAOFlagAndLogo'),
          value: ProposalVariant.ProposeChangeDaoFlag,
          group: getLabel('groupChangeConfig'),
        },
        {
          label: getLabel('proposeLegalStatusAndDoc'),
          value: ProposalVariant.ProposeChangeDaoLegalInfo,
          group: getLabel('groupChangeConfig'),
        },
      ],
    },
    {
      title: getLabel('groupChangePolicy'),
      disabled:
        !allowedProposalsToCreate[ProposalType.ChangePolicy] ||
        !isCanCreatePolicyProposals,
      options: [
        /*  {
          label: getLabel('proposeChangePolicy'),
          value: ProposalVariant.ProposeChangeVotingPolicy,
          group: getLabel('groupChangePolicy'),
        }, */
        {
          label: getLabel('proposeBondsAndDeadlines'),
          value: ProposalVariant.ProposeChangeBonds,
          group: getLabel('groupChangePolicy'),
        },
        {
          label: getLabel('proposeGroup'),
          value: ProposalVariant.ProposeCreateGroup,
          group: getLabel('groupChangePolicy'),
        },
      ],
    },
    {
      title: getLabel('groupChangeMembers'),
      disabled:
        !isCanCreatePolicyProposals ||
        (!allowedProposalsToCreate[ProposalType.AddMemberToRole] &&
          !allowedProposalsToCreate[ProposalType.RemoveMemberFromRole]),
      options: [
        {
          label: getLabel('proposeAddMember'),
          value: ProposalVariant.ProposeAddMember,
          group: getLabel('groupChangeMembers'),
          disabled: !allowedProposalsToCreate[ProposalType.AddMemberToRole],
        },
        {
          label: getLabel('proposeRemoveMember'),
          value: ProposalVariant.ProposeRemoveMember,
          group: getLabel('groupChangeMembers'),
          disabled:
            !allowedProposalsToCreate[ProposalType.RemoveMemberFromRole],
        },
      ],
    },
    {
      title: getLabel('groupVote'),
      disabled: !allowedProposalsToCreate[ProposalType.Vote],
      options: [
        {
          label: getLabel('proposePoll'),
          value: ProposalVariant.ProposePoll,
          group: getLabel('groupVote'),
          disabled: !allowedProposalsToCreate[ProposalType.Vote],
        },
      ],
    },
    {
      title: getLabel('groupFunctionCall'),
      disabled: !allowedProposalsToCreate[ProposalType.FunctionCall],
      options: [
        {
          label: getLabel('proposeCustomCall'),
          value: ProposalVariant.ProposeCustomFunctionCall,
          group: getLabel('groupFunctionCall'),
          disabled: !allowedProposalsToCreate[ProposalType.FunctionCall],
        },
      ],
    },
  ];

  if (canCreateTokenProposal) {
    const changeConfigGroup = config.find(
      ({ title }) => title === changeConfigTitle
    );

    changeConfigGroup?.options.push({
      label: getLabel('createToken'),
      value: ProposalVariant.ProposeCreateToken,
      group: getLabel('groupChangeConfig'),
      disabled: false,
    });

    config.push({
      title: getTitle('customFunction'),
      disabled: false,
      options: [
        {
          label: getTitle('distributionOfTokens'),
          value: ProposalVariant.ProposeTokenDistribution,
          group: getTitle('customFunction'),
        },
      ],
    });
  }

  return config;
}

export function getInputSize(
  t: TFunction,
  proposalType: ProposalVariant,
  max: number
): number {
  const options = getProposalTypesOptions(t, true, {} as ProposalPermissions);

  const length =
    options
      .reduce((r, k) => {
        r.push(...k.options);

        return r;
      }, [] as Option[])
      .find(item => item.value === proposalType)?.label?.length ?? max;

  return length >= max ? max : length;
}

export const extractMembersFromDao = (
  dao: DAO,
  membersStats: MemberStats[],
  activeTokenHolders: DaoDelegation[] = []
): Member[] => {
  const votesPerProposer = membersStats.reduce<Record<string, number>>(
    (res, item) => {
      res[item.accountId] = item.voteCount;

      return res;
    },
    {}
  );

  const members = {} as Record<string, Member>;

  dao.groups.forEach(grp => {
    const users = grp.members;

    users.forEach(user => {
      if (!members[user]) {
        members[user] = {
          id: nanoid(),
          name: user,
          groups: [grp.name],
          votes: votesPerProposer[user] ?? null,
        };
      } else {
        members[user] = {
          ...members[user],
          groups: [...members[user].groups, grp.name],
        };
      }
    });
  });

  activeTokenHolders.forEach(tokenHolder => {
    const user = tokenHolder.accountId;

    if (!members[user]) {
      members[user] = {
        id: nanoid(),
        name: user,
        groups: ['TokenHolders'],
        tokens: {
          // todo - get symbol
          symbol: 'TODO',
          value: Number(tokenHolder.balance ?? 0),
        },
        votes: votesPerProposer[user] ?? null,
      };
    } else {
      members[user] = {
        ...members[user],
        groups: [...members[user].groups, 'TokenHolders'],
        tokens: {
          // todo - get symbol
          symbol: 'TODO',
          value: Number(tokenHolder.balance ?? 0),
        },
      };
    }
  });

  return Object.values(members).map(item => {
    return {
      ...item,
      groups: Array.from(new Set(item.groups)),
    };
  });
};

function getAllowedGroups(dao: DAO) {
  return uniq(dao.groups.map(group => group.name));
}

function getUniqueGroups(dao: DAO) {
  const members = dao ? extractMembersFromDao(dao, []) : [];

  const availableGroups = members.reduce<string[]>((res, item) => {
    res.push(...item.groups);

    return res;
  }, []);

  return uniq(availableGroups);
}

export function getFormContentNode(
  proposalType: ProposalVariant,
  dao: DAO
): ReactNode | null {
  switch (proposalType) {
    case ProposalVariant.ProposeGetUpgradeCode: {
      return null;
    }
    case ProposalVariant.ProposeCreateBounty: {
      return <AddBountyContent />;
    }
    case ProposalVariant.ProposeDoneBounty: {
      return <BountyDoneContent />;
    }
    case ProposalVariant.ProposeTransfer: {
      return <TransferContent />;
    }
    case ProposalVariant.ProposeChangeDaoLinks: {
      return <ChangeLinksContent daoId={dao.id} />;
    }
    case ProposalVariant.ProposeChangeDaoName: {
      return <ChangeDaoNameContent daoId={dao.id} />;
    }
    case ProposalVariant.ProposeChangeDaoFlag: {
      return <ChangeDaoFlagContent daoId={dao.id} />;
    }
    case ProposalVariant.ProposeChangeDaoPurpose: {
      return <ChangeDaoPurposeContent daoId={dao.id} />;
    }
    case ProposalVariant.ProposeChangeDaoLegalInfo: {
      return <ChangeDaoLegalInfoContent daoId={dao.id} />;
    }
    case ProposalVariant.ProposePoll: {
      return null;
    }
    case ProposalVariant.ProposeAddMember: {
      const availableGroups = getAllowedGroups(dao);

      return <AddMemberToGroupContent groups={availableGroups} />;
    }
    case ProposalVariant.ProposeRemoveMember: {
      const availableGroups = getUniqueGroups(dao);

      return <RemoveMemberFromGroupContent groups={availableGroups} />;
    }
    case ProposalVariant.ProposeCreateGroup: {
      return <CreateGroupContent daoId={dao.id} />;
    }
    case ProposalVariant.ProposeChangeVotingPolicy: {
      const initialData = getInitialData(dao); // as Record<string, unknown>;

      return <ChangePolicyContent amount={initialData?.policy.amount} />;
    }
    case ProposalVariant.ProposeChangeBonds: {
      return <ChangeBondsContent dao={dao} />;
    }
    case ProposalVariant.ProposeCustomFunctionCall: {
      return <CustomFunctionCallContent dao={dao} />;
    }
    case ProposalVariant.ProposeStakingContractDeployment: {
      return <DeployStakingContractContent />;
    }
    case ProposalVariant.ProposeUpdateVotePolicyToWeightVoting: {
      return <UpdateVotePolicyToWeightVoting />;
    }
    case ProposalVariant.ProposeAcceptStakingContract: {
      return <AcceptStakingContractContent />;
    }
    case ProposalVariant.ProposeTokenDistribution: {
      const groups = dao.groups.map(group => {
        return {
          name: group.name,
          numberOfMembers: group.members.length,
          members: group.members,
        };
      });

      return (
        <TokenDistributionContent
          groups={groups}
          governanceToken={{ name: 'REF', value: 1000 }}
        />
      );
    }
    case ProposalVariant.ProposeCreateToken: {
      return <CreateTokenContent />;
    }
    case ProposalVariant.ProposeUpdateGroup: {
      return <UpdateGroupContent groups={[]} getDataFromContext />;
    }
    case ProposalVariant.ProposeChangeProposalVotingPermissions:
    case ProposalVariant.ProposeChangeProposalCreationPermissions: {
      return <ChangeVotingPermissionsContent />;
    }
    case ProposalVariant.ProposeCreateDao: {
      return <CreateDaoContent daoId={dao.id} />;
    }
    case ProposalVariant.ProposeTransferFunds: {
      return <TransferFundsContent />;
    }
    default: {
      return null;
    }
  }
}

export function mapProposalVariantToProposalType(
  proposalVariant: ProposalVariant
): ProposalType {
  switch (proposalVariant) {
    case ProposalVariant.ProposeTransfer: {
      return ProposalType.Transfer;
    }
    case ProposalVariant.ProposeCreateBounty: {
      return ProposalType.AddBounty;
    }
    case ProposalVariant.ProposeChangeDaoName:
    case ProposalVariant.ProposeChangeDaoPurpose:
    case ProposalVariant.ProposeChangeDaoLinks:
    case ProposalVariant.ProposeChangeDaoFlag:
    case ProposalVariant.ProposeChangeDaoLegalInfo: {
      return ProposalType.ChangeConfig;
    }
    case ProposalVariant.ProposeChangeVotingPolicy:
    case ProposalVariant.ProposeChangeBonds:
    case ProposalVariant.ProposeCreateGroup: {
      return ProposalType.ChangePolicy;
    }
    case ProposalVariant.ProposeAddMember: {
      return ProposalType.AddMemberToRole;
    }
    case ProposalVariant.ProposeRemoveMember: {
      return ProposalType.RemoveMemberFromRole;
    }
    case ProposalVariant.ProposeCustomFunctionCall: {
      return ProposalType.FunctionCall;
    }
    case ProposalVariant.ProposeUpdateVotePolicyToWeightVoting:
    case ProposalVariant.ProposeStakingContractDeployment:
    case ProposalVariant.ProposeAcceptStakingContract:
    case ProposalVariant.ProposeStakeTokens:
    case ProposalVariant.ProposeDelegateVoting: {
      return ProposalType.ChangePolicy;
    }
    default:
    case ProposalVariant.ProposePoll: {
      return ProposalType.Vote;
    }
  }
}

export function validateUserAccount(
  value: string | undefined,
  nearService: SputnikNearService | undefined | null
): Promise<boolean> | boolean {
  if (!value || !nearService) {
    return false;
  }

  const accountAddress = value.trim();

  return nearService?.nearAccountExist(accountAddress || '');
}

export function getGasValidation(t: TFunction): AnySchema {
  return yup
    .number()
    .typeError(t('validation.mustBeAValidNumber'))
    .positive()
    .min(MIN_GAS)
    .max(MAX_GAS)
    .required(t('validation.required'));
}

export function getValidationSchema(
  t: TFunction,
  proposalVariant?: ProposalVariant,
  dao?: DAO,
  data?: { [p: string]: unknown },
  nearService?: SputnikNearService,
  isDraft?: boolean
): yup.AnySchema {
  let schema: yup.AnySchema;

  switch (proposalVariant) {
    case ProposalVariant.ProposeTransfer: {
      schema = yup.object().shape({
        token: yup.string().required(t('validation.required')),
        amount: yup
          .number()
          .typeError(t('validation.mustBeAValidNumber'))
          .positive()
          .required(t('validation.required'))
          .test('onlyFiveDecimal', t('validation.onlyFiveOptDecimals'), value =>
            /^\d*(?:\.\d{0,5})?$/.test(`${value}`)
          ),
        target: yup.string().test({
          name: 'notValidNearAccount',
          exclusive: true,
          message: t('validation.onlyValidNearAccounts'),
          test: async value => validateUserAccount(value, nearService),
        }),
        details: yup.string().required(t('validation.required')),
        externalUrl: yup.string().url(),
        gas: getGasValidation(t),
      });
      break;
    }
    case ProposalVariant.ProposeCreateBounty: {
      schema = yup.object().shape({
        token: yup.string().required(t('validation.required')),
        amount: yup
          .number()
          .typeError(t('validation.mustBeAValidNumber'))
          .positive()
          .required(t('validation.required'))
          .test('onlyFiveDecimal', t('validation.onlyFiveOptDecimals'), value =>
            /^\d*(?:\.\d{0,5})?$/.test(`${value}`)
          ),
        slots: yup
          .number()
          .typeError(t('validation.mustBeAValidNumber'))
          .positive()
          .required(t('validation.required')),
        deadlineThreshold: yup
          .number()
          .typeError(t('validation.mustBeAValidNumber'))
          .positive()
          .required(t('validation.required')),
        details: yup.string().required(t('validation.required')),
        externalUrl: yup.string().url(),
        gas: getGasValidation(t),
      });
      break;
    }
    case ProposalVariant.ProposeChangeDaoName: {
      schema = yup.object().shape({
        displayName: yup.string().min(2).required(t('validation.required')),
        details: yup.string().required(t('validation.required')),
        externalUrl: yup.string().url(),
        gas: getGasValidation(t),
      });
      break;
    }
    case ProposalVariant.ProposeChangeDaoPurpose: {
      schema = yup.object().shape({
        purpose: yup.string().max(500).required(t('validation.required')),
        details: yup.string().required(t('validation.required')),
        externalUrl: yup.string().url(),
        gas: getGasValidation(t),
      });
      break;
    }
    case ProposalVariant.ProposeChangeDaoLinks: {
      schema = yup.object().shape({
        details: yup.string().required(t('validation.required')),
        externalUrl: yup.string().url(),
        links: yup.array().of(
          yup.object().shape({
            id: yup.string().required(),
            url: yup
              .string()
              .url(t('validation.validUrl'))
              .required(t('validation.canNotBeEmpty')),
          })
        ),
        gas: getGasValidation(t),
      });
      break;
    }
    case ProposalVariant.ProposeCreateGroup: {
      const id = dao?.id ?? null;

      schema = yup.object().shape({
        group: yup
          .string()
          .test('exitingGroup', t('validation.groupAlreadyExists'), value => {
            if (!value || !dao) {
              return false;
            }

            return !dao.groups
              .map(group => group.name.toLowerCase())
              .includes(value.trim().toLowerCase());
          })
          .required(t('validation.required')),
        memberName: yup
          .string()
          .test({
            name: 'notValidNearAccount',
            exclusive: true,
            message: t('validation.onlyValidNearAccounts'),
            test: async value => validateUserAccount(value, nearService),
          })
          .test(
            'daoMember',
            t('validation.daoCanNotBeSpecifiedInThisField'),
            value => {
              return !!id && value !== id;
            }
          )
          .required(t('validation.required')),
        details: yup.string().required(t('validation.required')),
        externalUrl: yup.string().url(),
        gas: getGasValidation(t),
      });
      break;
    }
    case ProposalVariant.ProposeAddMember: {
      const id = dao?.id ?? null;

      schema = yup.object().shape({
        group: yup.string().required(t('validation.required')),
        memberName: yup
          .string()
          .test({
            name: 'notValidNearAccount',
            exclusive: true,
            message: t('validation.onlyValidNearAccounts'),
            test: async value => validateUserAccount(value, nearService),
          })
          .test(
            'daoMember',
            t('validation.daoCanNotBeSpecifiedInThisField'),
            value => {
              return !!id && value !== id;
            }
          )
          .required(t('validation.required')),
        details: yup.string().required(t('validation.required')),
        externalUrl: yup.string().url(),
        gas: getGasValidation(t),
      });
      break;
    }
    case ProposalVariant.ProposeRemoveMember: {
      const id = dao?.id ?? null;

      schema = yup.object().shape({
        group: yup.string().required(t('validation.required')),
        memberName: yup
          .string()
          .test({
            name: 'notValidNearAccount',
            exclusive: true,
            message: t('validation.onlyValidNearAccounts'),
            test: async value => validateUserAccount(value, nearService),
          })
          .test(
            'daoMember',
            t('validation.daoCanNotBeSpecifiedInThisField'),
            value => {
              return !!id && value !== id;
            }
          )
          .test({
            name: 'lastMember',
            exclusive: true,
            message:
              'Cannot remove last member of the group. Group requires at least one member.',
            test: async (value, context) => {
              const selectedGroupName = context.parent.group;
              const selectedGroup = dao?.groups.find(
                item => item.name === selectedGroupName
              );

              if (
                selectedGroup &&
                value &&
                selectedGroup.members.includes(value)
              ) {
                return selectedGroup.members.length > 1;
              }

              return true;
            },
          })
          .test({
            name: 'notAMember',
            exclusive: true,
            message: 'This account is not a member of selected group',
            test: async (value, context) => {
              const selectedGroupName = context.parent.group;
              const selectedGroup = dao?.groups.find(
                item => item.name === selectedGroupName
              );

              return !(
                selectedGroup &&
                value &&
                !selectedGroup.members.includes(value)
              );
            },
          })
          .required(t('validation.required')),
        details: yup.string().required(t('validation.required')),
        externalUrl: yup.string().url(),
        gas: getGasValidation(t),
      });
      break;
    }
    case ProposalVariant.ProposeChangeBonds: {
      schema = yup.object().shape({
        details: yup.string().required(t('validation.required')),
        externalUrl: yup.string().url(),
        createProposalBond: yup.string().required(t('validation.required')),
        proposalExpireTime: yup.string().required(t('validation.required')),
        claimBountyBond: yup.string().required(t('validation.required')),
        unclaimBountyTime: yup.string().required(t('validation.required')),
        gas: getGasValidation(t),
      });
      break;
    }
    case ProposalVariant.ProposeChangeVotingPolicy: {
      schema = yup.object().shape({
        details: yup.string().required(t('validation.required')),
        externalUrl: yup.string().url(),
        amount: yup.string().required(t('validation.required')),
        gas: getGasValidation(t),
      });
      break;
    }
    case ProposalVariant.ProposeChangeDaoFlag: {
      schema = yup.object().shape({
        details: yup.string().required(t('validation.required')),
        externalUrl: yup.string().url(),
        flagCover: yup
          .mixed()
          .test({
            name: 'Required',
            message: t('validation.required'),
            exclusive: true,
            test: (value, context) => {
              const { flagLogo } = context.parent;

              return requiredImg(value) || requiredImg(flagLogo);
            },
          })
          .test('fileSize', getImgValidationError, validateImgSize),
        flagLogo: yup
          .mixed()
          .test({
            name: 'Required',
            message: t('validation.required'),
            exclusive: true,
            test: (value, context) => {
              const { flagCover } = context.parent;

              return requiredImg(value) || requiredImg(flagCover);
            },
          })
          .test('fileSize', getImgValidationError, validateImgSize),
        gas: getGasValidation(t),
      });
      break;
    }
    case ProposalVariant.ProposeChangeDaoLegalInfo: {
      schema = yup.object().shape({
        details: yup.string().required(t('validation.required')),
        legalStatus: yup.string().max(50),
        legalLink: yup.string().matches(VALID_URL_REGEXP, {
          message: t('validation.enterCorrectUrl'),
        }),
        gas: getGasValidation(t),
      });
      break;
    }
    case ProposalVariant.ProposeCustomFunctionCall: {
      const type = data?.functionCallType ?? FunctionCallType.Custom;

      switch (type) {
        case FunctionCallType.RemoveUpgradeCode: {
          schema = yup.object().shape({
            details: yup.string().required(t('validation.required')),
            externalUrl: yup.string().url(),
            gas: getGasValidation(t),
          });
          break;
        }
        case FunctionCallType.BuyNFTfromMintbase: {
          schema = yup.object().shape({
            tokenKey: yup.string().required(t('validation.required')),
            deposit: yup
              .number()
              .typeError(t('validation.mustBeAValidNumber'))
              .required(t('validation.required')),
            details: yup.string().required(t('validation.required')),
            externalUrl: yup.string().url(),
            actionsGas: getGasValidation(t),
            gas: getGasValidation(t),
          });
          break;
        }
        case FunctionCallType.VoteInAnotherDao: {
          const gerErr = (field: string) =>
            t(`proposalCard.voteInDao.${field}.required`);

          schema = yup.object().shape({
            targetDao: yup.string().required(gerErr('targetDao')),
            proposal: yup.string().required(gerErr('proposal')),
            vote: yup.string().required(gerErr('vote')),
            gas: getGasValidation(t),
          });
          break;
        }
        case FunctionCallType.TransferNFTfromMintbase: {
          schema = yup.object().shape({
            tokenKey: yup
              .string()
              .test('invalidFormat', t('proposalCard.tokenFormat'), value => {
                if (!value) {
                  return false;
                }

                const [key, store] = value.split(':');

                return !(!key || !store);
              })
              .required(t('validation.required')),
            target: yup.string().test({
              name: 'notValidNearAccount',
              exclusive: true,
              message: t('validation.onlyValidNearAccounts'),
              test: async value => validateUserAccount(value, nearService),
            }),
            details: yup.string().required(t('validation.required')),
            externalUrl: yup.string().url(),
            gas: getGasValidation(t),
          });
          break;
        }
        case FunctionCallType.BuyNFTfromParas: {
          schema = yup.object().shape({
            tokenKey: yup.string().required(t('validation.required')),
            deposit: yup
              .number()
              .positive()
              .typeError(t('validation.mustBeAValidNumber'))
              .required(t('validation.required')),
            target: yup.string().test({
              name: 'notValidNearAccount',
              exclusive: true,
              message: t('validation.onlyValidNearAccounts'),
              test: async value => validateUserAccount(value, nearService),
            }),
            details: yup.string().required(t('validation.required')),
            externalUrl: yup.string().url(),
            actionsGas: getGasValidation(t),
            gas: getGasValidation(t),
          });
          break;
        }
        case FunctionCallType.SwapsOnRef: {
          schema = yup.object().shape({
            pullId: yup
              .number()
              .typeError(t('validation.mustBeAValidNumber'))
              .required(t('validation.required')),
            tokenIn: yup.string().required(t('validation.required')),
            tokenOut: yup.string().required(t('validation.required')),
            amountIn: yup
              .number()
              .typeError(t('validation.mustBeAValidNumber'))
              .required(t('validation.required')),
            amountOut: yup
              .number()
              .typeError(t('validation.mustBeAValidNumber'))
              .required(t('validation.required')),
            amountInToken: yup.string().required(t('validation.required')),
            amountOutToken: yup.string().required(t('validation.required')),
            details: yup.string().required(t('validation.required')),
            externalUrl: yup.string().url(),
            gas: getGasValidation(t),
          });
          break;
        }
        case FunctionCallType.CreateRoketoStream: {
          schema = yup.object().shape({
            tokenId: yup.string().default('NEAR'),
            shouldDepositForDao: yup.boolean(),
            shouldDepositForReceiver: yup.boolean(),
            amount: yup.string().required(t('validation.required')),
            duration: yup.string().required(t('validation.required')),
            receiverId: yup.string().required(t('validation.required')),
            comment: yup.string(),
            receipt: yup.object().shape({
              // eslint-disable-next-line react/forbid-prop-types
              total: yup.object(),
              // eslint-disable-next-line react/forbid-prop-types
              positions: yup.array(),
            }),
            details: yup.string().required(t('validation.required')),
            externalUrl: yup.string().url(),
            gas: getGasValidation(t),
          });
          break;
        }
        default: {
          schema = yup.object().shape({
            smartContractAddress: yup
              .string()
              .required(t('validation.required')),
            methodName: yup
              .string()
              .matches(
                VALID_METHOD_NAME_REGEXP,
                t('validation.methodNameInvalid')
              )
              .required(t('validation.required')),
            deposit: yup
              .number()
              .typeError(t('validation.mustBeAValidNumber'))
              .required(t('validation.required')),
            json: yup
              .string()
              .required(t('validation.required'))
              .test('validJson', t('validation.jsonNotValid'), value => {
                try {
                  JSON.parse(value ?? '');
                } catch (e) {
                  return false;
                }

                return true;
              }),
            details: yup.string().required(t('validation.required')),
            externalUrl: yup.string().url(),
            actionsGas: getGasValidation(t),
            gas: getGasValidation(t),
          });
          break;
        }
      }

      break;
    }

    // todo - add validation
    case ProposalVariant.ProposeTokenDistribution: {
      schema = yup.object().shape({});

      break;
    }

    case ProposalVariant.ProposeStakingContractDeployment: {
      const votingPeriod = dao
        ? new Decimal(dao.policy.proposalPeriod).div('3.6e12').toString()
        : null;
      const min = votingPeriod || 1;

      schema = yup.object().shape({
        token: yup.string(),
        unstakingPeriod: yup
          .number()
          .typeError(t('validation.mustBeAValidNumber'))
          .positive()
          .min(
            +min,
            `Must be greater than proposal voting period: ${min} hours`
          )
          .required(t('validation.required')),
      });
      break;
    }

    case ProposalVariant.ProposeUpdateVotePolicyToWeightVoting: {
      schema = yup.object().shape({
        balance: yup
          .number()
          .typeError(t('validation.mustBeAValidNumber'))
          .integer()
          .positive()
          .min(1)
          .required(t('validation.required')),
        threshold: yup
          .number()
          .typeError(t('validation.mustBeAValidNumber'))
          .integer()
          .positive()
          .min(1)
          .required(t('validation.required')),
        quorum: yup
          .number()
          .typeError(t('validation.mustBeAValidNumber'))
          .integer()
          .min(0)
          .required(t('validation.required')),
        gas: getGasValidation(t),
      });
      break;
    }

    case ProposalVariant.ProposeAcceptStakingContract: {
      schema = yup.object().shape({
        contract: yup.string(),
      });
      break;
    }

    case ProposalVariant.ProposeCreateDao: {
      schema = yup.object().shape({
        details: yup.string().required(t('validation.required')),
        displayName: yup
          .string()
          .trim()
          .min(3, t('validation.atLeastThreeChars'))
          .matches(
            VALID_WEBSITE_NAME_REGEXP,
            t('validation.lettersNumbersHyphensSpaces')
          )
          .required(t('validation.required')),
      });
      break;
    }

    case ProposalVariant.ProposeTransferFunds: {
      const tokens = (data?.daoTokens as Record<string, Token>) ?? {};
      const tokensIds = Object.values(tokens)
        .filter(token => Number(token.balance) > 0)
        .map(item => item.symbol);

      const tokensFields = tokensIds.reduce<Record<string, AnySchema>>(
        (res, item) => {
          res[`${item}_amount`] = yup
            .number()
            .typeError(t('validation.mustBeAValidNumber'))
            .positive()
            .required(t('validation.required'))
            .test(
              'onlyFiveDecimal',
              t('validation.onlyFiveOptDecimals'),
              value => /^\d*(?:\.\d{0,5})?$/.test(`${value}`)
            );

          res[`${item}_target`] = yup.string().test({
            name: 'notValidNearAccount',
            exclusive: true,
            message: t('validation.onlyValidNearAccounts'),
            test: async value => validateUserAccount(value, nearService),
          });

          return res;
        },
        {}
      );

      schema = yup.object().shape({
        details: yup.string().required(t('validation.required')),
        ...tokensFields,
      });
      break;
    }
    case ProposalVariant.ProposeUpgradeSelf:
    case ProposalVariant.ProposeGetUpgradeCode:
    case ProposalVariant.ProposeRemoveUpgradeCode: {
      schema = yup.object().shape({
        details: yup.string().required(t('validation.required')),
      });
      break;
    }

    case ProposalVariant.ProposeDoneBounty:
    default: {
      schema = yup.object().shape({
        details: yup.string().required(t('validation.required')),
        externalUrl: yup.string().url(),
        gas: getGasValidation(t),
      });
      break;
    }
  }

  if (isDraft) {
    schema = schema.concat(
      yup.object().shape({
        details: yup.string().notRequired(),
        description: yup.string().required('Required'),
        title: yup.string().required('Required'),
      })
    );
  }

  return schema;
}
