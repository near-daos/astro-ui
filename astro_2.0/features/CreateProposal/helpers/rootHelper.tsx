// TODO refactor the helper. It's too big now.

import * as yup from 'yup';
import get from 'lodash/get';
import last from 'lodash/last';
import uniq from 'lodash/uniq';
import { nanoid } from 'nanoid';
import Decimal from 'decimal.js';
import dynamic from 'next/dynamic';
import endsWith from 'lodash/endsWith';
import React, { ReactNode } from 'react';

// Types
import {
  CreateProposalParams,
  DaoConfig,
  ProposalType,
  ProposalVariant,
} from 'types/proposal';
import {
  BondsAndDeadlinesData,
  CreateBountyInput,
  LinksFormData,
} from 'astro_2.0/features/CreateProposal/types';
import { DAO, Member } from 'types/dao';
import { IGroupForm } from 'features/groups/types';
import { MemberStats } from 'services/sputnik/mappers';
import { Option } from 'astro_2.0/features/CreateProposal/components/GroupedSelect';
import { CreateTransferInput } from 'astro_2.0/features/CreateProposal/components/types';

// Constants
import { VALID_URL_REGEXP } from 'constants/regexp';
import {
  DEFAULT_PROPOSAL_GAS,
  MAX_GAS,
  MIN_GAS,
  YOKTO_NEAR,
} from 'services/sputnik/constants';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';

// Context
import { Tokens } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

// Config
import { nearConfig } from 'config';

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

// Helpers & Utils
import {
  getInitialData,
  getNewProposalObject as getNewVotingPolicyProposalObject,
  VotingPolicyPageInitialData,
} from 'features/vote-policy/helpers';
import {
  getAddMemberProposal,
  getChangePolicyProposal,
  getRemoveMemberProposal,
} from 'features/groups/helpers';
import {
  CustomFunctionCallInput,
  getCustomFunctionCallProposal,
} from 'astro_2.0/features/CreateProposal/proposalObjectHelpers';
import {
  getImgValidationError,
  requiredImg,
  validateImgSize,
} from 'utils/imageValidators';
import { jsonToBase64Str } from 'utils/jsonToBase64Str';

// Services
import { SputnikNearService } from 'services/sputnik';
import awsUploader from 'services/AwsUploader/AwsUploader';

// Local helpers
import {
  getAddBountyProposal,
  getChangeBondDeadlinesProposal,
  getCompleteBountyProposal,
} from './bountiesHelpers';

const CustomFunctionCallContent = dynamic(
  import(
    'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent'
  ),
  {
    ssr: false,
  }
);

function getChangeConfigProposal(
  daoId: string,
  { name, purpose, metadata }: DaoConfig,
  reason: string,
  proposalBond: string
): CreateProposalParams {
  return {
    kind: 'ChangeConfig',
    daoId,
    data: {
      config: {
        metadata,
        name,
        purpose,
      },
    },
    description: reason,
    bond: proposalBond,
  };
}

async function getTransferProposal(
  dao: DAO,
  data: CreateTransferInput,
  tokens: Tokens
): Promise<CreateProposalParams> {
  const token = Object.values(tokens).find(item => item.symbol === data.token);

  if (!token) {
    throw new Error('No tokens data found');
  }

  return {
    daoId: dao.id,
    description: `${data.details}${EXTERNAL_LINK_SEPARATOR}${data.externalUrl}`,
    kind: 'Transfer',
    bond: dao.policy.proposalBond,
    data: {
      token_id: token?.tokenId,
      receiver_id: data.target,
      amount: new Decimal(data.amount).mul(10 ** token.decimals).toFixed(),
    },
  };
}

export function getProposalTypesOptions(
  isCanCreatePolicyProposals: boolean
): {
  title: string;
  options: Option[];
  disabled: boolean;
}[] {
  return [
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
      title: 'Change Config',
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
    default: {
      return null;
    }
  }
}

export function getFormInitialValues(
  selectedProposalType: ProposalVariant,
  accountId: string
): Record<string, unknown> {
  switch (selectedProposalType) {
    case ProposalVariant.ProposeCreateBounty: {
      return {
        details: '',
        externalUrl: '',
        token: 'NEAR',
        amount: '',
        slots: '',
        deadlineThreshold: '',
        deadlineUnits: 'days',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeDoneBounty: {
      return {
        details: '',
        externalUrl: '',
        target: accountId,
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeTransfer: {
      return {
        details: '',
        externalUrl: '',
        token: 'NEAR',
        amount: '',
        target: '',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeChangeDaoName: {
      return {
        details: '',
        externalUrl: '',
        displayName: '',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeChangeDaoPurpose: {
      return {
        details: '',
        externalUrl: '',
        purpose: '',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeChangeDaoLinks: {
      return {
        details: '',
        externalUrl: '',
        links: [],
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeChangeDaoLegalInfo: {
      return {
        details: '',
        externalUrl: '',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposePoll: {
      return {
        details: '',
        externalUrl: '',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeCreateGroup:
    case ProposalVariant.ProposeAddMember:
    case ProposalVariant.ProposeRemoveMember: {
      return {
        details: '',
        externalUrl: '',
        group: '',
        memberName: '',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeChangeVotingPolicy: {
      return {
        details: '',
        externalUrl: '',
        amount: '',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeChangeBonds: {
      return {
        details: '',
        externalUrl: '',
        createProposalBond: '',
        claimBountyBond: '',
        proposalExpireTime: '',
        unclaimBountyTime: '',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeChangeDaoFlag: {
      return {
        details: '',
        externalUrl: '',
        flagCover: '',
        flagLogo: '',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeCustomFunctionCall: {
      return {
        details: '',
        externalUrl: '',
        smartContractAddress: '',
        methodName: '',
        json: '',
        deposit: '0',
        token: 'NEAR',
        actionsGas: 0.15,
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    default: {
      return {};
    }
  }
}

function getFlagsParamsForMetadata(
  dao: DAO
): {
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
          links: ((data as unknown) as LinksFormData).links
            .map(item => item.url)
            .filter(item => item.length > 0),
          displayName: dao.displayName,
        }),
      };

      return getChangeConfigProposal(
        dao.id,
        newDaoConfig,
        `${data.details}${EXTERNAL_LINK_SEPARATOR}${data.externalUrl}`,
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
        `${data.details}${EXTERNAL_LINK_SEPARATOR}${data.externalUrl}`,
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
        `${data.details}${EXTERNAL_LINK_SEPARATOR}${data.externalUrl}`,
        dao.policy.proposalBond
      );
    }
    case ProposalVariant.ProposePoll: {
      return {
        daoId: dao.id,
        description: `${data.details}${EXTERNAL_LINK_SEPARATOR}${data.externalUrl}`,
        kind: 'Vote',
        bond: dao.policy.proposalBond,
      };
    }
    case ProposalVariant.ProposeRemoveMember: {
      return getRemoveMemberProposal((data as unknown) as IGroupForm, dao);
    }
    case ProposalVariant.ProposeAddMember: {
      return getAddMemberProposal((data as unknown) as IGroupForm, dao);
    }
    case ProposalVariant.ProposeCreateGroup: {
      return getChangePolicyProposal((data as unknown) as IGroupForm, dao);
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
        (data as unknown) as BondsAndDeadlinesData,
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
        `${data.details}${EXTERNAL_LINK_SEPARATOR}${data.externalUrl}`
      );
    }
    case ProposalVariant.ProposeChangeDaoFlag: {
      const uploadImg = async (img: File) => {
        if (img) {
          const { Key } = await awsUploader.uploadToBucket(img);

          return Key;
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
        `${data.details}${EXTERNAL_LINK_SEPARATOR}${data.externalUrl}`,
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
        `${data.details}${EXTERNAL_LINK_SEPARATOR}${data.externalUrl}`,
        dao.policy.proposalBond
      );
    }
    case ProposalVariant.ProposeCustomFunctionCall: {
      return getCustomFunctionCallProposal(
        dao,
        data as CustomFunctionCallInput,
        tokens
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

  return SputnikNearService.nearAccountExist(value || '');
}

export const gasValidation = yup
  .number()
  .typeError('Must be a valid number.')
  .positive()
  .min(MIN_GAS)
  .max(MAX_GAS)
  .required('Required');

export function getValidationSchema(
  proposalVariant?: ProposalVariant
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
            'DAO can not be specified in this field',
            value => {
              return !endsWith(value, nearConfig.contractName);
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
      return yup.object().shape({
        smartContractAddress: yup.string().required('Required'),
        methodName: yup.string().required('Required'),
        deposit: yup
          .number()
          .typeError('Must be a valid number.')
          .required('Required')
          .test(
            'onlyFiveDecimal',
            'Only numbers with five optional decimal place please',
            value => /^\d*(?:\.\d{0,5})?$/.test(`${value}`)
          ),
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
        actionsGas: yup
          .number()
          .typeError('Must be a valid number.')
          .max(0.3)
          .min(0.01)
          .required('Required'),
        gas: gasValidation,
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
