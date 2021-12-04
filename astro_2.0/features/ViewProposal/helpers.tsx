import React, { ReactNode } from 'react';
import Decimal from 'decimal.js';

import { DAO } from 'types/dao';
import { DaoRole } from 'types/role';
import { Proposal, ProposalType, ProposalVariant } from 'types/proposal';

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
import { CustomFunctionCallContent } from 'astro_2.0/features/ViewProposal/components/CustomFunctionCallContent';
import { ChangeDaoLegalInfoContent } from 'astro_2.0/features/ViewProposal//components/ChangeDaoLegalInfoContent';

import { getDistanceFromNow } from 'astro_2.0/components/BountyCard/helpers';

export function getContentNode(proposal: Proposal, dao: DAO): ReactNode {
  let content;

  switch (proposal?.proposalVariant) {
    case ProposalVariant.ProposeTransfer: {
      if (proposal.kind.type === ProposalType.Transfer) {
        content = (
          <TransferContent
            amount={proposal.kind.amount}
            token={proposal.kind.tokenId}
            target={proposal.kind.receiverId}
          />
        );
        break;
      }

      break;
    }
    case ProposalVariant.ProposeCreateBounty: {
      if (proposal.kind.type === ProposalType.AddBounty) {
        const bountyData = proposal.kind.bounty;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const [, value] = getDistanceFromNow(bountyData.maxDeadline).split(' ');

        content = (
          <AddBountyContent
            slots={bountyData.times}
            deadlineThreshold={value}
            token={bountyData.token}
            amount={bountyData.amount}
          />
        );
        break;
      }

      break;
    }
    case ProposalVariant.ProposeChangeDaoName: {
      if (proposal.kind.type === ProposalType.ChangeConfig) {
        const meta = proposal.kind.config.metadata
          ? fromBase64ToMetadata(proposal.kind.config.metadata)
          : null;

        content = (
          <ChangeDaoNameContent
            daoId={dao.id}
            displayName={meta?.displayName ?? ''}
          />
        );
        break;
      }

      break;
    }
    case ProposalVariant.ProposeChangeDaoPurpose: {
      if (proposal.kind.type === ProposalType.ChangeConfig) {
        content = (
          <ChangeDaoPurposeContent
            daoId={dao.id}
            purpose={proposal.kind.config.purpose}
          />
        );
        break;
      }

      break;
    }
    case ProposalVariant.ProposeChangeDaoLinks: {
      if (proposal.kind.type === ProposalType.ChangeConfig) {
        const meta = proposal.kind.config.metadata
          ? fromBase64ToMetadata(proposal.kind.config.metadata)
          : null;

        content = (
          <ChangeLinksContent daoId={dao.id} links={meta?.links ?? []} />
        );
        break;
      }

      break;
    }
    case ProposalVariant.ProposeChangeDaoFlag: {
      if (proposal.kind.type === ProposalType.ChangeConfig) {
        const meta = proposal.kind.config.metadata
          ? fromBase64ToMetadata(proposal.kind.config.metadata)
          : null;

        const cover = getAwsImageUrl(meta?.flagCover);
        const logo = getAwsImageUrl(meta?.flagLogo);

        content = (
          <ChangeDaoFlagContent daoId={dao.id} cover={cover} logo={logo} />
        );
        break;
      }

      break;
    }
    case ProposalVariant.ProposeChangeDaoLegalInfo: {
      if (proposal.kind.type === ProposalType.ChangeConfig) {
        const meta = proposal.kind.config.metadata
          ? fromBase64ToMetadata(proposal.kind.config.metadata)
          : null;

        const { legalLink, legalStatus } = meta?.legal || {};

        content = (
          <ChangeDaoLegalInfoContent
            daoId={dao.id}
            legalLink={legalLink}
            legalStatus={legalStatus}
          />
        );
      }

      break;
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

        content = <ChangePolicyContent amount={initialData?.policy.amount} />;
        break;
      }

      break;
    }
    case ProposalVariant.ProposeChangeBonds: {
      if (proposal.kind.type === ProposalType.ChangePolicy) {
        const { policy } = proposal.kind;

        content = (
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
        break;
      }

      break;
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

          content = (
            <CreateGroupContent
              daoId={dao.id}
              group={(newGroup as DaoRole).name}
              memberName={memberName}
            />
          );
          break;
        }

        break;
      }

      break;
    }
    case ProposalVariant.ProposeAddMember: {
      if (proposal.kind.type === ProposalType.AddMemberToRole) {
        content = (
          <AddMemberToGroupContent
            group={proposal.kind.role}
            memberName={proposal.kind.memberId}
          />
        );
        break;
      }

      break;
    }
    case ProposalVariant.ProposeRemoveMember: {
      if (proposal.kind.type === ProposalType.RemoveMemberFromRole) {
        content = (
          <RemoveMemberFromGroupContent
            group={proposal.kind.role}
            memberName={proposal.kind.memberId}
          />
        );
        break;
      }

      break;
    }
    case ProposalVariant.ProposeCustomFunctionCall: {
      if (proposal.kind.type === ProposalType.FunctionCall) {
        try {
          const { kind } = proposal;
          const data = kind.actions[0];

          const json = JSON.parse(
            Buffer.from(data.args, 'base64').toString('ascii')
          );

          content = (
            <CustomFunctionCallContent
              token="NEAR"
              smartContractAddress={kind.receiverId}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              methodName={data.methodName}
              json={JSON.stringify(json, null, 2)}
              deposit={data.deposit}
            />
          );
          break;
        } catch (e) {
          break;
        }
      }

      break;
    }
    default: {
      break;
    }
  }

  // Fallback for proposals made via CLI
  if (!content) {
    switch (proposal.kind.type) {
      case ProposalType.AddBounty: {
        const bountyData = proposal.kind.bounty;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const [, value] = getDistanceFromNow(bountyData.maxDeadline).split(' ');

        content = (
          <AddBountyContent
            slots={bountyData.times}
            deadlineThreshold={value}
            token={bountyData.token}
            amount={bountyData.amount}
          />
        );
        break;
      }
      case ProposalType.AddMemberToRole: {
        content = (
          <AddMemberToGroupContent
            group={proposal.kind.role}
            memberName={proposal.kind.memberId}
          />
        );
        break;
      }
      case ProposalType.RemoveMemberFromRole: {
        content = (
          <RemoveMemberFromGroupContent
            group={proposal.kind.role}
            memberName={proposal.kind.memberId}
          />
        );
        break;
      }
      case ProposalType.Transfer: {
        content = (
          <TransferContent
            amount={proposal.kind.amount}
            token={proposal.kind.tokenId}
            target={proposal.kind.receiverId}
          />
        );
        break;
      }
      case ProposalType.FunctionCall: {
        try {
          const { kind } = proposal;
          const data = kind.actions[0];

          const json = Buffer.from(data.args, 'base64').toString('ascii');

          content = (
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
          break;
        } catch (e) {
          break;
        }
      }
      default: {
        content = null;
      }
    }
  }

  return content;
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
