import * as yup from 'yup';
import {
  CreateProposalParams,
  ProposalType,
  ProposalVariant,
} from 'types/proposal';
import { ReactNode } from 'react';
import { AddBountyContent } from 'astro_2.0/features/CreateProposal/components/AddBountyContent';
import { TransferContent } from 'astro_2.0/features/CreateProposal/components/TransferContent';
import { DAO } from 'types/dao';
import { getAddBountyProposal } from 'features/bounty/dialogs/create-bounty-dialog/helpers';
import { CreateBountyInput } from 'features/bounty/dialogs/create-bounty-dialog/types';
import { Tokens } from 'context/CustomTokensContext';
import { Option } from 'astro_2.0/features/CreateProposal/components/GroupedSelect';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';
import Decimal from 'decimal.js';
// import { SputnikNearService } from 'services/sputnik';
import { CreateTransferInput } from 'astro_2.0/features/CreateProposal/components/types';
import { AnySchema } from 'yup';

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

export function getFormContentNode(
  proposalType: ProposalVariant
): ReactNode | null {
  switch (proposalType) {
    case ProposalVariant.ProposeCreateBounty: {
      return <AddBountyContent />;
    }
    case ProposalVariant.ProposeTransfer: {
      return <TransferContent />;
    }
    default: {
      return null;
    }
  }
}

export function getFormInitialValues(
  selectedProposalType: ProposalVariant
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
        description: '',
        selectedToken: 'NEAR',
        amount: 0,
        target: '',
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
    default: {
      return yup.object().shape({
        details: yup.string().required(),
        externalUrl: yup.string(),
      });
    }
  }
}
