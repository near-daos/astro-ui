import React, { ReactNode } from 'react';
import Decimal from 'decimal.js';

import { Proposal, ProposalType, ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';

import { formatYoktoValue } from 'helpers/format';
import { getInitialData } from 'features/vote-policy/helpers';

import { fromBase64ToMetadata } from 'services/sputnik/mappers';
import { getAwsImageUrl } from 'services/sputnik/mappers/utils/getAwsImageUrl';
import { YOKTO_NEAR } from 'services/sputnik/constants';

import { TransferContent } from 'astro_2.0/features/ViewProposal/components/TransferContent';
import { AddBountyContent } from 'astro_2.0/features/ViewProposal/components/AddBountyContent';
import { ChangeDaoNameContent } from 'astro_2.0/features/ViewProposal/components/ChangeDaoNameContent';
import { ChangeDaoPurposeContent } from 'astro_2.0/features/ViewProposal/components/ChangeDaoPurposeContent';
import { ChangeLinksContent } from 'astro_2.0/features/ViewProposal/components/ChangeLinksContent';
import { ChangeDaoFlagContent } from 'astro_2.0/features/ViewProposal/components/ChangeDaoFlagContent';
import { ChangePolicyContent } from 'astro_2.0/features/ViewProposal/components/ChangePolicyContent';
import { ChangeBondsContent } from 'astro_2.0/features/ViewProposal/components/ChangeBondsContent';
import { CreateGroupContent } from 'astro_2.0/features/ViewProposal/components/CreateGroupContent';
import { AddMemberToGroupContent } from 'astro_2.0/features/ViewProposal/components/AddMemberToGroupContent';
import { RemoveMemberFromGroupContent } from 'astro_2.0/features/ViewProposal/components/RemoveMemberFromGroupContent';
import { DaoRole } from 'types/role';
import { getDistanceFromNow } from 'astro_2.0/components/BountyCard/helpers';
import CustomFunctionCallContent from 'astro_2.0/features/ViewProposal/components/CustomFunctionCallContent';

export function getContentNode(proposal: Proposal, dao: DAO): ReactNode {
  switch (proposal?.proposalVariant) {
    case ProposalVariant.ProposeTransfer: {
      if (proposal.kind.type === ProposalType.Transfer) {
        return (
          <TransferContent
            amount={formatYoktoValue(proposal.kind.amount)}
            token={proposal.kind.tokenId}
            target={proposal.kind.receiverId}
          />
        );
      }

      return null;
    }
    case ProposalVariant.ProposeCreateBounty: {
      if (proposal.kind.type === ProposalType.AddBounty) {
        const bountyData = proposal.kind.bounty;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const [, value] = getDistanceFromNow(bountyData.maxDeadline).split(' ');

        return (
          <AddBountyContent
            slots={bountyData.times}
            deadlineThreshold={value}
            token={bountyData.token}
            amount={formatYoktoValue(bountyData.amount)}
          />
        );
      }

      return null;
    }
    case ProposalVariant.ProposeChangeDaoName: {
      if (proposal.kind.type === ProposalType.ChangeConfig) {
        const meta = proposal.kind.config.metadata
          ? fromBase64ToMetadata(proposal.kind.config.metadata)
          : null;

        return (
          <ChangeDaoNameContent
            daoId={dao.id}
            displayName={meta?.displayName ?? ''}
          />
        );
      }

      return null;
    }
    case ProposalVariant.ProposeChangeDaoPurpose: {
      if (proposal.kind.type === ProposalType.ChangeConfig) {
        return (
          <ChangeDaoPurposeContent
            daoId={dao.id}
            purpose={proposal.kind.config.purpose}
          />
        );
      }

      return null;
    }
    case ProposalVariant.ProposeChangeDaoLinks: {
      if (proposal.kind.type === ProposalType.ChangeConfig) {
        const meta = proposal.kind.config.metadata
          ? fromBase64ToMetadata(proposal.kind.config.metadata)
          : null;

        return <ChangeLinksContent daoId={dao.id} links={meta?.links ?? []} />;
      }

      return null;
    }
    case ProposalVariant.ProposeChangeDaoFlag: {
      if (proposal.kind.type === ProposalType.ChangeConfig) {
        const meta = proposal.kind.config.metadata
          ? fromBase64ToMetadata(proposal.kind.config.metadata)
          : null;

        const cover = getAwsImageUrl(meta?.flagCover);
        const logo = getAwsImageUrl(meta?.flagLogo);

        return (
          <ChangeDaoFlagContent daoId={dao.id} cover={cover} logo={logo} />
        );
      }

      return null;
    }
    case ProposalVariant.ProposeChangeVotingPolicy: {
      if (proposal.kind.type === ProposalType.ChangePolicy) {
        const dvp = proposal.kind.policy.defaultVotePolicy;

        const initialData = getInitialData({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          policy: {
            defaultVotePolicy: {
              ...dvp,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ratio: dvp.threshold,
            },
          },
        }); // as Record<string, unknown>;

        return <ChangePolicyContent amount={initialData?.policy.amount} />;
      }

      return null;
    }
    case ProposalVariant.ProposeChangeBonds: {
      if (proposal.kind.type === ProposalType.ChangePolicy) {
        const { policy } = proposal.kind;

        return (
          <ChangeBondsContent
            dao={dao}
            createProposalBond={new Decimal(policy.proposalBond)
              .div(YOKTO_NEAR)
              .toNumber()}
            claimBountyBond={new Decimal(policy.bountyBond)
              .div(YOKTO_NEAR)
              .toNumber()}
            proposalExpireTime={new Decimal(policy.proposalPeriod)
              .div('3.6e12')
              .toNumber()}
            unclaimBountyTime={new Decimal(policy.bountyForgivenessPeriod)
              .div('3.6e12')
              .toNumber()}
          />
        );
      }

      return null;
    }
    case ProposalVariant.ProposeCreateGroup: {
      if (proposal.kind.type === ProposalType.ChangePolicy) {
        const daoGroups = dao.policy.roles.map(item => item.name);
        const proposalGroups = proposal.kind.policy.roles;

        let newGroup;

        // TODO - how can we understand what was the new group?
        // once it is approved groups in dao and proposal are the same

        proposalGroups.forEach(group => {
          if (!daoGroups.includes(group.name)) {
            newGroup = group as DaoRole;
          }
        });

        if (newGroup) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const memberName = newGroup?.kind?.group[0] ?? '';

          return (
            <CreateGroupContent
              daoId={dao.id}
              group={(newGroup as DaoRole).name}
              memberName={memberName}
            />
          );
        }

        return null;
      }

      return null;
    }
    case ProposalVariant.ProposeAddMember: {
      if (proposal.kind.type === ProposalType.AddMemberToRole) {
        return (
          <AddMemberToGroupContent
            group={proposal.kind.role}
            memberName={proposal.kind.memberId}
          />
        );
      }

      return null;
    }
    case ProposalVariant.ProposeRemoveMember: {
      if (proposal.kind.type === ProposalType.RemoveMemberFromRole) {
        return (
          <RemoveMemberFromGroupContent
            group={proposal.kind.role}
            memberName={proposal.kind.memberId}
          />
        );
      }

      return null;
    }
    case ProposalVariant.ProposeCustomFunctionCall: {
      if (proposal.kind.type === ProposalType.FunctionCall) {
        try {
          const { kind } = proposal;
          const data = kind.actions[0];

          const json = JSON.parse(
            Buffer.from(data.args, 'base64').toString('ascii')
          );

          return (
            <CustomFunctionCallContent
              token="NEAR"
              smartContractAddress={kind.receiverId}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              methodName={data.methodName}
              json={json}
              deposit={data.deposit}
            />
          );
        } catch (e) {
          return null;
        }
      }

      return null;
    }
    default: {
      return null;
    }
  }
}

export function getProposalVariantLabel(
  variant: ProposalVariant,
  type: ProposalType
): string {
  switch (variant) {
    case ProposalVariant.ProposeCreateBounty: {
      return 'Create a Bounty';
    }
    case ProposalVariant.ProposeDoneBounty: {
      return 'Bounty Done';
    }
    case ProposalVariant.ProposeTransfer: {
      return 'Transfer';
    }
    case ProposalVariant.ProposeChangeDaoName: {
      return 'Change DAO name';
    }
    case ProposalVariant.ProposeChangeDaoPurpose: {
      return 'Change DAO purpose';
    }
    case ProposalVariant.ProposeChangeDaoLinks: {
      return 'Change DAO links';
    }
    case ProposalVariant.ProposePoll: {
      return 'Poll';
    }
    case ProposalVariant.ProposeCreateGroup: {
      return 'Create group';
    }
    case ProposalVariant.ProposeAddMember: {
      return 'Add member to Role';
    }
    case ProposalVariant.ProposeRemoveMember: {
      return 'Remove member from Role';
    }
    case ProposalVariant.ProposeChangeVotingPolicy: {
      return 'Change Voting Policy';
    }
    case ProposalVariant.ProposeChangeBonds: {
      return 'Change Bonds and Deadlines';
    }
    case ProposalVariant.ProposeChangeDaoFlag: {
      return 'Change DAO flag';
    }
    default: {
      return type;
    }
  }
}
