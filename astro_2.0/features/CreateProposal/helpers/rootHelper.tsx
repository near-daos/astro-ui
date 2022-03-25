// TODO refactor the helper. It's too big now.

import * as yup from 'yup';
import uniq from 'lodash/uniq';
import { nanoid } from 'nanoid';
import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';

// Types
import { ProposalType, ProposalVariant } from 'types/proposal';
import { DAO, Member } from 'types/dao';
import { MemberStats } from 'services/sputnik/mappers';
import { Option } from 'astro_2.0/features/CreateProposal/components/GroupedSelect';
import { FunctionCallType } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/types';

// Constants
import { VALID_URL_REGEXP } from 'constants/regexp';
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
import { ContractAcceptanceContent } from 'astro_2.0/features/CreateProposal/components/ContractAcceptanceContent';

// Helpers & Utils
import { getInitialData } from 'features/vote-policy/helpers';

import {
  getImgValidationError,
  requiredImg,
  validateImgSize,
} from 'utils/imageValidators';

const CustomFunctionCallContent = dynamic(
  import(
    'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent'
  ),
  {
    ssr: false,
  }
);

export function getProposalTypesOptions(
  isCanCreatePolicyProposals: boolean,
  canCreateTokenProposal = false
): {
  title: string;
  options: Option[];
  disabled: boolean;
}[] {
  const changeConfigTitle = 'Change Config';

  const config = [
    {
      title: 'Transfer/Add bounty',
      disabled: false,
      options: [
        {
          label: 'Propose a Transfer',
          value: ProposalVariant.ProposeTransfer,
          group: 'Transfer/Add bounty',
        },
        {
          label: 'Propose to Create a Bounty',
          value: ProposalVariant.ProposeCreateBounty,
          group: 'Transfer/Add bounty',
        },
      ],
    },
    {
      title: changeConfigTitle,
      disabled: !isCanCreatePolicyProposals,
      options: [
        {
          label: 'Propose to Change DAO Name',
          value: ProposalVariant.ProposeChangeDaoName,
          group: 'Change Config',
        },
        {
          label: 'Propose to Change DAO Purpose',
          value: ProposalVariant.ProposeChangeDaoPurpose,
          group: 'Change Config',
        },
        {
          label: 'Propose to Change DAO Links',
          value: ProposalVariant.ProposeChangeDaoLinks,
          group: 'Change Config',
        },
        {
          label: 'Propose to Change DAO Flag and Logo',
          value: ProposalVariant.ProposeChangeDaoFlag,
          group: 'Change Config',
        },
        {
          label: 'Propose to change DAO Legal Status and Doc',
          value: ProposalVariant.ProposeChangeDaoLegalInfo,
          group: 'Change Config',
        },
      ],
    },
    {
      title: 'Change Policy',
      disabled: !isCanCreatePolicyProposals,
      options: [
        {
          label: 'Propose to Change Voting Policy',
          value: ProposalVariant.ProposeChangeVotingPolicy,
          group: 'Change Policy',
        },
        {
          label: 'Propose to Change Bonds and Deadlines',
          value: ProposalVariant.ProposeChangeBonds,
          group: 'Change Policy',
        },
        {
          label: 'Propose to Create a Group',
          value: ProposalVariant.ProposeCreateGroup,
          group: 'Change Policy',
        },
      ],
    },
    {
      title: 'Change Members of DAO',
      disabled: !isCanCreatePolicyProposals,
      options: [
        {
          label: 'Propose to Add Member to Group',
          value: ProposalVariant.ProposeAddMember,
          group: 'Change Members of DAO',
        },
        {
          label: 'Propose to Remove Member from Group',
          value: ProposalVariant.ProposeRemoveMember,
          group: 'Change Members of DAO',
        },
      ],
    },
    {
      title: 'Vote',
      disabled: false,
      options: [
        {
          label: 'Propose a Poll',
          value: ProposalVariant.ProposePoll,
          group: 'Vote',
        },
      ],
    },
    {
      title: 'Function Call',
      disabled: false,
      options: [
        {
          label: 'Custom Function Call',
          value: ProposalVariant.ProposeCustomFunctionCall,
          group: 'Function Call',
        },
      ],
    },
  ];

  if (canCreateTokenProposal) {
    const changeConfigGroup = config.find(
      ({ title }) => title === changeConfigTitle
    );

    changeConfigGroup?.options.push({
      label: 'Create Token',
      value: ProposalVariant.ProposeCreateToken,
      group: 'Change Config',
    });

    config.push({
      title: 'Custom Function',
      disabled: false,
      options: [
        {
          label: 'Distribution of tokens',
          value: ProposalVariant.ProposeTokenDistribution,
          group: 'Custom Function',
        },
      ],
    });
  }

  return config;
}

export function getInputSize(
  proposalType: ProposalVariant,
  max: number
): number {
  const options = getProposalTypesOptions(true);

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
  membersStats: MemberStats[]
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
          // TODO - tokens are now hidden in UI
          tokens: {
            type: 'NEAR',
            value: 18,
            percent: 14,
          },
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

  return Object.values(members).map(item => {
    return {
      ...item,
      groups: Array.from(new Set(item.groups)),
    };
  });
};

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
      const availableGroups = getUniqueGroups(dao);

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
      return <CustomFunctionCallContent />;
    }
    case ProposalVariant.ProposeContractAcceptance: {
      return <ContractAcceptanceContent tokenId="someverylonglongname.near" />;
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
    default:
    case ProposalVariant.ProposePoll: {
      return ProposalType.Vote;
    }
  }
}

function validateUserAccount(
  value: string | undefined
): Promise<boolean> | boolean {
  if (!value) {
    return false;
  }

  if (
    navigator &&
    navigator.userAgent.indexOf('Safari') !== -1 &&
    navigator.userAgent.indexOf('Chrome') === -1
  ) {
    const result = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/.test(
      `${value}`
    );

    return Promise.resolve(result);
  }

  return window.nearService.nearAccountExist(value || '');
}

export const gasValidation = yup
  .number()
  .typeError('Must be a valid number.')
  .positive()
  .min(MIN_GAS)
  .max(MAX_GAS)
  .required('Required');

export function getValidationSchema(
  proposalVariant?: ProposalVariant,
  dao?: DAO,
  data?: { [p: string]: unknown }
): yup.AnySchema {
  switch (proposalVariant) {
    case ProposalVariant.ProposeTransfer: {
      return yup.object().shape({
        token: yup.string().required('Required'),
        amount: yup
          .number()
          .typeError('Must be a valid number.')
          .positive()
          .required('Required')
          .test(
            'onlyFiveDecimal',
            'Only numbers with five optional decimal place please',
            value => /^\d*(?:\.\d{0,5})?$/.test(`${value}`)
          ),
        target: yup
          .string()
          .test(
            'notValidNearAccount',
            'Only valid near accounts are allowed',
            validateUserAccount
          ),
        details: yup.string().required('Required'),
        externalUrl: yup.string().url(),
        gas: gasValidation,
      });
    }
    case ProposalVariant.ProposeCreateBounty: {
      return yup.object().shape({
        token: yup.string().required('Required'),
        amount: yup
          .number()
          .typeError('Must be a valid number.')
          .positive()
          .required('Required')
          .test(
            'onlyFiveDecimal',
            'Only numbers with five optional decimal place please',
            value => /^\d*(?:\.\d{0,5})?$/.test(`${value}`)
          ),
        slots: yup
          .number()
          .typeError('Must be a valid number.')
          .positive()
          .required('Required'),
        deadlineThreshold: yup
          .number()
          .typeError('Must be a valid number.')
          .positive()
          .required('Required'),
        details: yup.string().required('Required'),
        externalUrl: yup.string().url(),
        gas: gasValidation,
      });
    }
    case ProposalVariant.ProposeChangeDaoName: {
      return yup.object().shape({
        displayName: yup.string().min(2).required('Required'),
        details: yup.string().required('Required'),
        externalUrl: yup.string().url(),
        gas: gasValidation,
      });
    }
    case ProposalVariant.ProposeChangeDaoPurpose: {
      return yup.object().shape({
        purpose: yup.string().max(500).required('Required'),
        details: yup.string().required('Required'),
        externalUrl: yup.string().url(),
        gas: gasValidation,
      });
    }
    case ProposalVariant.ProposeChangeDaoLinks: {
      return yup.object().shape({
        details: yup.string().required('Required'),
        externalUrl: yup.string().url(),
        links: yup.array().of(
          yup.object().shape({
            id: yup.string().required(),
            url: yup
              .string()
              .url('Must be a valid URL')
              .required('Cannot be empty'),
          })
        ),
      });
    }
    case ProposalVariant.ProposeCreateGroup:
    case ProposalVariant.ProposeAddMember:
    case ProposalVariant.ProposeRemoveMember: {
      const id = dao?.id ?? null;

      return yup.object().shape({
        group: yup.string().required('Required'),
        memberName: yup
          .string()
          .test(
            'notValidNearAccount',
            'Only valid near accounts are allowed',
            validateUserAccount
          )
          .test(
            'daoMember',
            'Current DAO can not be specified in this field',
            value => {
              return !!id && value !== id;
            }
          )
          .required('Required'),
        details: yup.string().required('Required'),
        externalUrl: yup.string().url(),
        gas: gasValidation,
      });
    }
    case ProposalVariant.ProposeChangeBonds: {
      return yup.object().shape({
        details: yup.string().required('Required'),
        externalUrl: yup.string().url(),
        createProposalBond: yup.string().required('Required'),
        proposalExpireTime: yup.string().required('Required'),
        claimBountyBond: yup.string().required('Required'),
        unclaimBountyTime: yup.string().required('Required'),
        gas: gasValidation,
      });
    }
    case ProposalVariant.ProposeChangeVotingPolicy: {
      return yup.object().shape({
        details: yup.string().required('Required'),
        externalUrl: yup.string().url(),
        amount: yup.string().required('Required'),
        gas: gasValidation,
      });
    }
    case ProposalVariant.ProposeChangeDaoFlag: {
      return yup.object().shape({
        details: yup.string().required('Required'),
        externalUrl: yup.string().url(),
        flagCover: yup
          .mixed()
          .test('Required', 'Required', requiredImg)
          .test('fileSize', getImgValidationError, validateImgSize),
        flagLogo: yup
          .mixed()
          .test('Required', 'Required', requiredImg)
          .test('fileSize', getImgValidationError, validateImgSize),
        gas: gasValidation,
      });
    }
    case ProposalVariant.ProposeChangeDaoLegalInfo: {
      return yup.object().shape({
        details: yup.string().required('Required'),
        legalStatus: yup.string().max(50),
        legalLink: yup.string().matches(VALID_URL_REGEXP, {
          message: 'Enter correct url!',
        }),
        gas: gasValidation,
      });
    }
    case ProposalVariant.ProposeCustomFunctionCall: {
      const type = data?.functionCallType ?? FunctionCallType.Custom;

      switch (type) {
        case FunctionCallType.BuyNFTfromMintbase: {
          return yup.object().shape({
            tokenKey: yup.string().required('Required'),
            price: yup
              .number()
              .typeError('Must be a valid number.')
              .required('Required'),
            timeout: yup.string().required('Required'),
            deposit: yup
              .number()
              .typeError('Must be a valid number.')
              .required('Required'),
            details: yup.string().required('Required'),
            externalUrl: yup.string().url(),
            actionsGas: gasValidation,
            gas: gasValidation,
          });
        }
        case FunctionCallType.TransferNFTfromMintbase: {
          return yup.object().shape({
            tokenKey: yup.string().required('Required'),
            target: yup
              .string()
              .test(
                'notValidNearAccount',
                'Only valid near accounts are allowed',
                validateUserAccount
              ),
            details: yup.string().required('Required'),
            externalUrl: yup.string().url(),
            gas: gasValidation,
          });
        }
        case FunctionCallType.BuyNFTfromParas: {
          return yup.object().shape({
            smartContractAddress: yup.string().required('Required'),
            methodName: yup.string().required('Required'),
            tokenKey: yup.string().required('Required'),
            timeout: yup.string().required('Required'),
            price: yup
              .number()
              .typeError('Must be a valid number.')
              .required('Required'),
            target: yup
              .string()
              .test(
                'notValidNearAccount',
                'Only valid near accounts are allowed',
                validateUserAccount
              ),
            details: yup.string().required('Required'),
            externalUrl: yup.string().url(),
            actionsGas: gasValidation,
            gas: gasValidation,
          });
        }
        case FunctionCallType.SwapsOnRef: {
          return yup.object().shape({
            pullId: yup
              .number()
              .typeError('Must be a valid number.')
              .required('Required'),
            tokenIn: yup.string().required('Required'),
            tokenOut: yup.string().required('Required'),
            amountIn: yup
              .number()
              .typeError('Must be a valid number.')
              .required('Required'),
            amountOut: yup
              .number()
              .typeError('Must be a valid number.')
              .required('Required'),
            amountInToken: yup.string().required('Required'),
            amountOutToken: yup.string().required('Required'),
            details: yup.string().required('Required'),
            externalUrl: yup.string().url(),
            gas: gasValidation,
          });
        }
        default: {
          return yup.object().shape({
            smartContractAddress: yup.string().required('Required'),
            methodName: yup.string().required('Required'),
            deposit: yup
              .number()
              .typeError('Must be a valid number.')
              .required('Required'),
            json: yup
              .string()
              .required('Required')
              .test('validJson', 'Provided JSON is not valid', value => {
                try {
                  JSON.parse(value ?? '');
                } catch (e) {
                  return false;
                }

                return true;
              }),
            details: yup.string().required('Required'),
            externalUrl: yup.string().url(),
            actionsGas: gasValidation,
            gas: gasValidation,
          });
        }
      }
    }

    // todo - add validation
    case ProposalVariant.ProposeTokenDistribution: {
      return yup.object().shape({});
    }

    case ProposalVariant.ProposeContractAcceptance: {
      return yup.object().shape({
        unstakingPeriod: yup
          .number()
          .typeError('Must be a valid number.')
          .positive()
          .min(1)
          .required('Required'),
      });
    }

    case ProposalVariant.ProposeDoneBounty:
    default: {
      return yup.object().shape({
        details: yup.string().required('Required'),
        externalUrl: yup.string().url(),
        gas: gasValidation,
      });
    }
  }
}
