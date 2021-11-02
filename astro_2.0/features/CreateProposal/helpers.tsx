import * as yup from 'yup';
import { AnySchema } from 'yup';
import {
  CreateProposalParams,
  DaoConfig,
  Proposal,
  ProposalType,
  ProposalVariant,
} from 'types/proposal';
import React, { ReactNode } from 'react';
import { AddBountyContent } from 'astro_2.0/features/CreateProposal/components/AddBountyContent';
import { TransferContent } from 'astro_2.0/features/CreateProposal/components/TransferContent';
import { DAO, Member } from 'types/dao';
import { getAddBountyProposal } from 'features/bounty/dialogs/create-bounty-dialog/helpers';
import { CreateBountyInput } from 'features/bounty/dialogs/create-bounty-dialog/types';
import { Tokens } from 'context/CustomTokensContext';
import { Option } from 'astro_2.0/features/CreateProposal/components/GroupedSelect';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';
import Decimal from 'decimal.js';
// import { SputnikNearService } from 'services/sputnik';
import { CreateTransferInput } from 'astro_2.0/features/CreateProposal/components/types';
import { ChangeLinksContent } from 'astro_2.0/features/CreateProposal/components/ChangeLinksContent';
import { nanoid } from 'nanoid';
import {
  BondsAndDeadlinesData,
  getChangeBondDeadlinesProposal,
  getChangeConfigProposal,
} from 'features/dao-settings/helpers';
import { ChangeDaoNameContent } from 'astro_2.0/features/CreateProposal/components/ChangeDaoNameContent';
import { ChangeDaoPurposeContent } from 'astro_2.0/features/CreateProposal/components/ChangeDaoPurposeContent';
import {
  getAddMemberProposal,
  getChangePolicyProposal,
  getRemoveMemberProposal,
} from 'features/groups/helpers';
import { IGroupForm } from 'features/groups/types';
import { RemoveMemberFromGroupContent } from 'astro_2.0/features/CreateProposal/components/RemoveMemberFromGroupContent';
import { DaoMetadata } from 'services/sputnik/mappers';
import { LinksFormData } from 'features/dao-settings/components/links-tab';
import { CreateGroupContent } from 'astro_2.0/features/CreateProposal/components/CreateGroupContent';
import {
  getInitialData,
  getNewProposalObject as getNewVotingPolicyProposalObject,
  VotingPolicyPageInitialData,
} from 'features/vote-policy/helpers';
import { ChangePolicyContent } from 'astro_2.0/features/CreateProposal/components/ChangePolicyContent';
import { YOKTO_NEAR } from 'services/sputnik/constants';
import { ChangeBondsContent } from 'astro_2.0/features/CreateProposal/components/ChangeBondsContent';

// import { SputnikNearService } from 'services/sputnik';

export function getProposalTypesOptions(): {
  title: string;
  options: Option[];
}[] {
  return [
    {
      title: 'Transfer/Add bounty',
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
      options: [
        {
          label: 'Propose to Change DAO name',
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
      ],
    },
    {
      title: 'Change Policy',
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
      title: 'Add/Remove member to Role',
      options: [
        {
          label: 'Propose to Add member to Group',
          value: ProposalVariant.ProposeAddMember,
          group: 'Add/Remove member to Role',
        },
        {
          label: 'Propose to Remove member from Group',
          value: ProposalVariant.ProposeRemoveMember,
          group: 'Add/Remove member to Role',
        },
      ],
    },
    {
      title: 'Vote',
      options: [
        {
          label: 'Propose a Poll',
          value: ProposalVariant.ProposePoll,
          group: 'Vote',
        },
      ],
    },
  ];
}

export function getInputSize(proposalType: ProposalVariant): number {
  const options = getProposalTypesOptions();

  return (
    options
      .reduce((r, k) => {
        r.push(...k.options);

        return r;
      }, [] as Option[])
      .find(item => item.value === proposalType)?.label?.length ?? 120
  );
}

export const extractMembersFromDao = (
  dao: DAO,
  proposals: Proposal[]
): Member[] => {
  const votesPerProposer = proposals.reduce((acc, currentProposal) => {
    const vote = currentProposal.votes[currentProposal.proposer];

    if (vote) {
      if (acc[currentProposal.proposer]) {
        acc[currentProposal.proposer] += 1;
      } else {
        acc[currentProposal.proposer] = 1;
      }
    }

    return acc;
  }, {} as Record<string, number>);

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

export const fromMetadataToBase64 = (metadata: DaoMetadata): string => {
  return Buffer.from(JSON.stringify(metadata)).toString('base64');
};

export function getFormContentNode(
  proposalType: ProposalVariant,
  dao: DAO
): ReactNode | null {
  switch (proposalType) {
    case ProposalVariant.ProposeCreateBounty: {
      return <AddBountyContent />;
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
    case ProposalVariant.ProposeChangeDaoPurpose: {
      return <ChangeDaoPurposeContent daoId={dao.id} />;
    }
    case ProposalVariant.ProposePoll: {
      return null;
    }
    case ProposalVariant.ProposeAddMember:
    case ProposalVariant.ProposeRemoveMember: {
      const members = dao ? extractMembersFromDao(dao, []) : [];

      const availableGroups = members.reduce<string[]>((res, item) => {
        res.push(...item.groups);

        return res;
      }, []);

      return <RemoveMemberFromGroupContent groups={availableGroups} />;
    }
    case ProposalVariant.ProposeCreateGroup: {
      return <CreateGroupContent daoId={dao.id} />;
    }
    case ProposalVariant.ProposeChangeVotingPolicy: {
      return <ChangePolicyContent />;
    }
    case ProposalVariant.ProposeChangeBonds: {
      return <ChangeBondsContent daoId={dao.id} />;
    }
    default: {
      return null;
    }
  }
}

export function getFormInitialValues(
  selectedProposalType: ProposalVariant,
  dao: DAO
): Record<string, unknown> {
  switch (selectedProposalType) {
    case ProposalVariant.ProposeCreateBounty: {
      return {
        details: '',
        externalUrl: '',
        token: 'NEAR',
        amount: 0,
        slots: 3,
        deadlineThreshold: 14,
        deadlineUnits: 'days',
      };
    }
    case ProposalVariant.ProposeTransfer: {
      return {
        details: '',
        externalUrl: '',
        token: 'NEAR',
        amount: 0,
        target: '',
      };
    }
    case ProposalVariant.ProposeChangeDaoName: {
      return {
        details: '',
        externalUrl: '',
        displayName: '',
      };
    }
    case ProposalVariant.ProposeChangeDaoPurpose: {
      return {
        details: dao.description,
        externalUrl: '',
        purpose: '',
      };
    }
    case ProposalVariant.ProposeChangeDaoLinks: {
      return {
        details: '',
        externalUrl: '',
        links:
          dao?.links?.map(url => ({
            url,
            id: nanoid(),
          })) ?? [],
      };
    }
    case ProposalVariant.ProposePoll: {
      return {
        details: '',
        externalUrl: '',
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
      };
    }
    case ProposalVariant.ProposeChangeVotingPolicy: {
      const initialData = getInitialData(dao); // as Record<string, unknown>;

      return {
        details: '',
        externalUrl: '',
        amount: initialData?.policy.amount,
      };
    }
    case ProposalVariant.ProposeChangeBonds: {
      return {
        details: '',
        externalUrl: '',
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
      };
    }
    default: {
      return {};
    }
  }
}

async function getTransferProposal(
  dao: DAO,
  data: CreateTransferInput,
  tokens: Tokens
): Promise<CreateProposalParams> {
  const token = tokens[data.token];

  if (token.tokenId) {
    // await SputnikNearService.registerUserToToken(token.tokenId);
  }

  return {
    daoId: dao.id,
    description: `${data.details}${EXTERNAL_LINK_SEPARATOR}${data.externalUrl}`,
    kind: 'Transfer',
    bond: dao.policy.proposalBond,
    data: {
      token_id: token.tokenId,
      receiver_id: data.target,
      amount: new Decimal(data.amount).mul(10 ** token.decimals).toFixed(),
    },
  };
}

export async function getNewProposalObject(
  dao: DAO,
  proposalType: ProposalVariant,
  data: Record<string, unknown>,
  tokens: Tokens
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
    case ProposalVariant.ProposeChangeDaoLinks: {
      const url = dao?.logo?.split('/');
      const fileName = url[url.length - 1];

      const newDaoConfig: DaoConfig = {
        name: dao.name,
        purpose: dao.description,
        metadata: fromMetadataToBase64({
          links: ((data as unknown) as LinksFormData).links.map(
            item => item.url
          ),
          flag: fileName,
          displayName: dao.displayName,
        }),
      };

      return getChangeConfigProposal(
        dao.id,
        newDaoConfig,
        'Changing links',
        dao.policy.proposalBond
      );
    }
    case ProposalVariant.ProposeChangeDaoName: {
      const url = dao?.logo?.split('/');
      const fileName = url[url.length - 1];

      const newDaoConfig: DaoConfig = {
        name: dao.name,
        purpose: dao.description,
        metadata: fromMetadataToBase64({
          links: dao.links,
          flag: fileName,
          displayName: data.displayName as string,
        }),
      };

      return getChangeConfigProposal(
        dao.id,
        newDaoConfig,
        'Changing name/purpose',
        dao.policy.proposalBond
      );
    }
    case ProposalVariant.ProposeChangeDaoPurpose: {
      const url = dao?.logo?.split('/');
      const fileName = url[url.length - 1];

      const newDaoConfig: DaoConfig = {
        name: dao.name,
        purpose: data.purpose as string,
        metadata: fromMetadataToBase64({
          links: dao.links,
          flag: fileName,
          displayName: dao.displayName,
        }),
      };

      return getChangeConfigProposal(
        dao.id,
        newDaoConfig,
        'Changing name/purpose',
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
        dao.policy.proposalBond
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
    case ProposalVariant.ProposeChangeDaoFlag: {
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

export function getValidationSchema(
  proposalVariant?: ProposalVariant
): AnySchema {
  switch (proposalVariant) {
    case ProposalVariant.ProposeTransfer: {
      return yup.object().shape({
        token: yup.string().required(),
        amount: yup
          .number()
          .typeError('Must be a valid number.')
          .positive()
          .required()
          .test(
            'onlyOneDecimal',
            'Only numbers with one optional decimal place please',
            value => /^\d*(?:\.\d)?$/.test(`${value}`)
          ),
        // target: yup
        //   .string()
        //   .test(
        //     'notValidNearAccount',
        //     'Only valid near accounts are allowed',
        //     value => SputnikNearService.nearAccountExist(value || '')
        //   ),
        details: yup.string().required(),
        externalUrl: yup.string().url(),
      });
    }
    case ProposalVariant.ProposeCreateBounty: {
      return yup.object().shape({
        token: yup.string().required(),
        amount: yup
          .number()
          .typeError('Must be a valid number.')
          .positive()
          .required()
          .test(
            'onlyOneDecimal',
            'Only numbers with one optional decimal place please',
            value => /^\d*(?:\.\d)?$/.test(`${value}`)
          ),
        slots: yup
          .number()
          .typeError('Must be a valid number.')
          .positive()
          .required(),
        deadlineThreshold: yup
          .number()
          .typeError('Must be a valid number.')
          .positive()
          .required(),
        details: yup.string().required(),
        externalUrl: yup.string().url(),
      });
    }
    case ProposalVariant.ProposeChangeDaoName: {
      return yup.object().shape({
        displayName: yup.string().min(2).required(),
        details: yup.string().required(),
        externalUrl: yup.string().url(),
      });
    }
    case ProposalVariant.ProposeChangeDaoPurpose: {
      return yup.object().shape({
        purpose: yup.string().max(500).required(),
        externalUrl: yup.string().url(),
      });
    }
    case ProposalVariant.ProposeCreateGroup:
    case ProposalVariant.ProposeAddMember:
    case ProposalVariant.ProposeRemoveMember: {
      return yup.object().shape({
        group: yup.string().required(),
        memberName: yup.string().required(),
        details: yup.string().required(),
        externalUrl: yup.string(),
      });
    }
    case ProposalVariant.ProposeChangeBonds: {
      return yup.object().shape({
        details: yup.string().required(),
        externalUrl: yup.string(),
        createProposalBond: yup.number().min(0).required(),
        proposalExpireTime: yup.number().integer().min(1).required(),
        claimBountyBond: yup.number().min(0).required(),
        unclaimBountyTime: yup.number().integer().min(1).required(),
      });
    }
    case ProposalVariant.ProposeChangeVotingPolicy:
    default: {
      return yup.object().shape({
        details: yup.string().required(),
        externalUrl: yup.string(),
      });
    }
  }
}
