import Decimal from 'decimal.js';
import React, { ReactNode } from 'react';
import { TFunction } from 'next-i18next';
import { differenceInDays, parseISO } from 'date-fns';

import { DAO, TGroup } from 'types/dao';
import {
  ProposalFeedItem,
  ProposalKind,
  ProposalType,
  ProposalVariant,
} from 'types/proposal';
import { BountyProposal } from 'types/bounties';

import { getInitialData } from 'features/vote-policy/helpers';

import { fromBase64ToMetadata } from 'services/sputnik/mappers';
import { getAwsImageUrl } from 'services/sputnik/mappers/utils/getAwsImageUrl';
import {
  DEFAULT_CREATE_DAO_GAS,
  DEFAULT_PROPOSAL_GAS,
  DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
  YOKTO_NEAR,
} from 'services/sputnik/constants';

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
import { UpdateVotePolicyToWeightVoting } from 'astro_2.0/features/ViewProposal/components/UpdateVotePolicyToWeightVoting';

import { nanosToDays } from 'astro_2.0/features/DaoGovernance/helper';
import { formatYoktoValue, getDistanceFromNow, toMillis } from 'utils/format';
import { TokenDistributionContent } from 'astro_2.0/features/ViewProposal/components/TokenDistributionContent';
import { ContractAcceptanceContent } from 'astro_2.0/features/ViewProposal/components/ContractAcceptanceContent';
import {
  getInitialCreationPermissions,
  getInitialVotingPermissions,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/helpers';
import { ChangePermissionsContent } from 'astro_2.0/features/ViewProposal/components/ChangePermissionsContent';
import { UpdateGroupContent } from 'astro_2.0/features/CreateProposal/components/UpdateGroupContent';
import { CreateDaoContent } from 'astro_2.0/features/ViewProposal/components/CreateDaoContent';
import { Token } from 'types/token';
import { getAllowedProposalsToVote } from 'astro_2.0/features/CreateProposal/createProposalHelpers';

import { ViewVoteInOtherDao } from './components/CustomFunctionCallContent/components/ViewVoteInOtherDao';

export function getContentNode(proposal: ProposalFeedItem): ReactNode {
  const { dao } = proposal;
  let content;

  try {
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
          const deadline = nanosToDays(bountyData.maxDeadline);

          content = (
            <AddBountyContent
              slots={bountyData.times}
              deadlineThreshold={deadline.join(' ')}
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
      case ProposalVariant.ProposeUpdateGroup: {
        if (proposal.kind.type === ProposalType.ChangePolicy) {
          const groups = proposal.kind.policy.roles
            .filter(el => el.kind !== 'Everyone' && el.name !== 'TokenHolders')
            .map(
              role =>
                ({
                  name: role.name,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  members: role.kind.group,
                  permissions: role.permissions,
                  slug: role.name.replaceAll(' ', '_'),
                  votePolicy: {
                    ...role.votePolicy,
                    defaultPolicy: dao.policy.defaultVotePolicy,
                  },
                } as TGroup)
            );

          content = <UpdateGroupContent groups={groups} />;
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
              daoId={dao.id}
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
          const proposalGroups = proposal.kind.policy.roles
            .map(item => ({
              ...item,
              createdAt: parseISO(item.createdAt),
            }))
            .sort((a, b) => {
              if (a.createdAt > b.createdAt) {
                return 1;
              }

              if (a.createdAt < b.createdAt) {
                return -1;
              }

              return 0;
            });

          const newGroup = proposalGroups[proposalGroups.length - 1];

          if (newGroup) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const memberName = newGroup?.kind?.group[0] ?? '';

            content = (
              <CreateGroupContent
                daoId={dao.id}
                group={newGroup.name}
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

            content = kind.actions.map((data, i) => {
              const json = JSON.parse(
                Buffer.from(data.args, 'base64').toString('utf-8')
              );

              return (
                <CustomFunctionCallContent
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  token="NEAR"
                  smartContractAddress={kind.receiverId}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  methodName={data.methodName}
                  json={JSON.stringify(json, null, 2)}
                  deposit={data.deposit}
                  isLastItem={i === kind.actions.length - 1}
                />
              );
            });

            break;
          } catch (e) {
            content = null;
            break;
          }
        }

        break;
      }
      case ProposalVariant.ProposeStakingContractDeployment: {
        content = <ContractAcceptanceContent proposal={proposal} />;

        break;
      }
      case ProposalVariant.ProposeTokenDistribution: {
        content = (
          <TokenDistributionContent
            proposer="anima.testnet"
            governanceToken={{ name: 'REF', value: 700 }}
            groups={[
              {
                name: 'Mages',
                groupTotal: '300',
                isCustom: true,
                members: [
                  { name: 'anima.testnet', value: 200 },
                  { name: 'animatronic.testnet', value: 100 },
                ],
              },
              {
                name: 'Warriors',
                groupTotal: '200',
                isCustom: false,
                members: [
                  { name: 'james.testnet', value: 0 },
                  { name: 'ethan.testnet', value: 0 },
                ],
              },
            ]}
          />
        );

        break;
      }
      case ProposalVariant.ProposeChangeProposalCreationPermissions: {
        if (proposal.kind.type === ProposalType.ChangePolicy) {
          const initialData = getInitialCreationPermissions({
            policy: {
              roles: proposal.kind.policy.roles
                // .filter(role => role.kind !== 'Everyone')
                .map(role => ({
                  kind: role.kind,
                  name: role.name,
                  permissions: role.permissions,
                })),
            },
          });

          content = <ChangePermissionsContent initialData={initialData} />;
        }

        break;
      }
      case ProposalVariant.ProposeChangeProposalVotingPermissions: {
        if (proposal.kind.type === ProposalType.ChangePolicy) {
          const initialData = getInitialVotingPermissions({
            policy: {
              roles: proposal.kind.policy.roles
                // .filter(role => role.kind !== 'Everyone')
                .map(role => ({
                  kind: role.kind,
                  name: role.name,
                  permissions: role.permissions,
                })),
            },
          });

          content = <ChangePermissionsContent initialData={initialData} />;
        }

        break;
      }
      case ProposalVariant.ProposeUpdateVotePolicyToWeightVoting: {
        if (proposal.kind.type === ProposalType.ChangePolicy) {
          const { policy } = proposal.kind;

          const holdersRole = policy.roles.find(
            role => role.name === 'TokenHolders' && role.kind !== 'Everyone'
          );

          let balance;
          let threshold;
          let quorum;

          if (holdersRole) {
            if (typeof holdersRole.kind !== 'string') {
              if (Reflect.has(holdersRole.kind, 'member')) {
                balance = (holdersRole.kind as Record<string, string>).member;
              }
            }

            const votePolicy = holdersRole.votePolicy.vote as unknown as {
              threshold: string;
              quorum: string;
            };

            threshold = votePolicy?.threshold;
            quorum = votePolicy?.quorum;
          }

          content = (
            <UpdateVotePolicyToWeightVoting
              balance={balance ?? '0'}
              quorum={quorum ?? '0'}
              threshold={threshold ?? '0'}
              daoId={proposal.daoId}
            />
          );
        }

        break;
      }
      case ProposalVariant.ProposeCreateDao: {
        if (proposal.kind.type === ProposalType.FunctionCall) {
          try {
            const { kind } = proposal;
            const data = kind.actions[0];

            const json = JSON.parse(
              Buffer.from(data.args, 'base64').toString('utf-8')
            );

            content = <CreateDaoContent displayName={json.name} />;
            break;
          } catch (e) {
            break;
          }
        }

        break;
      }
      case ProposalVariant.ProposeTransferFunds:
      case ProposalVariant.ProposeRemoveUpgradeCode:
      case ProposalVariant.ProposeUpgradeSelf:
      case ProposalVariant.ProposeGetUpgradeCode: {
        if (proposal.kind.type === ProposalType.FunctionCall) {
          content = <div />;
        }

        break;
      }
      case ProposalVariant.VoteInAnotherDao: {
        content = <ViewVoteInOtherDao proposal={proposal} />;

        break;
      }
      default: {
        break;
      }
    }

    // Fallback for proposals made via CLI
    if (!content) {
      switch (proposal?.kind?.type) {
        case ProposalType.AddBounty: {
          const bountyData = proposal.kind.bounty;

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const [, value] = getDistanceFromNow(bountyData.maxDeadline).split(
            ' '
          );

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

            content = kind.actions.map((data, i) => {
              const json = JSON.parse(
                Buffer.from(data.args, 'base64').toString('utf-8')
              );

              return (
                <CustomFunctionCallContent
                  token="NEAR"
                  smartContractAddress={kind.receiverId}
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  methodName={data.methodName}
                  json={JSON.stringify(json, null, 2)}
                  deposit={data.deposit}
                  isLastItem={i === kind.actions.length - 1}
                />
              );
            });

            break;
          } catch (e) {
            content = null;
            break;
          }
        }
        default: {
          content = null;
        }
      }
    }

    return content;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);

    return null;
  }
}

export function getProposalVariantLabel(
  variant: ProposalVariant,
  type: ProposalType,
  t: TFunction
): string {
  const getVarLabel = (key: string) =>
    t(`viewProposalCard.proposalVariant.${key}`);

  const getTypeLabel = (key: string) =>
    t(`viewProposalCard.proposalType.${key}`);

  switch (variant) {
    case ProposalVariant.ProposeCreateBounty: {
      return getVarLabel('createBounty');
    }
    case ProposalVariant.ProposeDoneBounty: {
      return getVarLabel('bountyDone');
    }
    case ProposalVariant.ProposeTransfer: {
      return getVarLabel('transfer');
    }
    case ProposalVariant.ProposeChangeDaoName: {
      return getVarLabel('changeDaoName');
    }
    case ProposalVariant.ProposeChangeDaoPurpose: {
      return getVarLabel('changeDaoPurpose');
    }
    case ProposalVariant.ProposeChangeDaoLinks: {
      return getVarLabel('changeDaoLinks');
    }
    case ProposalVariant.ProposePoll: {
      return getVarLabel('poll');
    }
    case ProposalVariant.ProposeCreateGroup: {
      return getVarLabel('createGroup');
    }
    case ProposalVariant.ProposeAddMember: {
      return getVarLabel('addMember');
    }
    case ProposalVariant.ProposeRemoveMember: {
      return getVarLabel('removeMember');
    }
    case ProposalVariant.ProposeChangeVotingPolicy: {
      return getVarLabel('changeVotingPolicy');
    }
    case ProposalVariant.ProposeChangeBonds: {
      return getVarLabel('changeBonds');
    }
    case ProposalVariant.ProposeChangeDaoFlag: {
      return getVarLabel('changeDaoFlag');
    }
    case ProposalVariant.ProposeTokenDistribution: {
      return getVarLabel('tokenDistribution');
    }
    case ProposalVariant.ProposeChangeProposalCreationPermissions: {
      return getVarLabel('changeProposalCreationPermissions');
    }
    case ProposalVariant.ProposeChangeProposalVotingPermissions: {
      return getVarLabel('changeProposalVotingPermissions');
    }
    case ProposalVariant.ProposeGetUpgradeCode: {
      return getVarLabel('getCodeFromFactory');
    }
    case ProposalVariant.ProposeUpgradeSelf: {
      return getVarLabel('upgradeDao');
    }
    case ProposalVariant.ProposeRemoveUpgradeCode: {
      return getVarLabel('recoverStorageCosts');
    }
    case ProposalVariant.ProposeCreateDao: {
      return getVarLabel('createDao');
    }
    case ProposalVariant.ProposeStakingContractDeployment: {
      return getVarLabel('deployStakingContract');
    }
    case ProposalVariant.ProposeAcceptStakingContract: {
      return getVarLabel('contractAcceptance');
    }
    case ProposalVariant.VoteInAnotherDao: {
      return getVarLabel('voteInAnotherDao');
    }
    default: {
      switch (type) {
        case ProposalType.AddBounty:
          return getTypeLabel('addBounty');
        case ProposalType.ChangePolicy:
          return getTypeLabel('changePolicy');
        case ProposalType.ChangeConfig:
          return getTypeLabel('changeConfig');
        case ProposalType.FunctionCall:
          return getTypeLabel('functionCall');
        default:
          return type;
      }
    }
  }
}

export function checkIsCouncilUser(
  accountId: string,
  dao: DAO | null
): boolean {
  if (!accountId || !dao) {
    return false;
  }

  const councilGroup = dao.groups.find(item => item.name === 'Council');

  if (!councilGroup) {
    return false;
  }

  return councilGroup.members.includes(accountId);
}

export function isSaveTemplateActionAvailable(
  proposal: ProposalFeedItem,
  accountId: string
): boolean {
  const unsupportedVariants = [
    ProposalVariant.ProposeGetUpgradeCode,
    ProposalVariant.ProposeRemoveUpgradeCode,
    ProposalVariant.ProposeUpgradeSelf,
    ProposalVariant.ProposeCreateDao,
    ProposalVariant.ProposeTransferFunds,
    ProposalVariant.ProposeStakingContractDeployment,
  ];

  return (
    !unsupportedVariants.includes(proposal?.proposalVariant) &&
    proposal?.kind?.type === ProposalType.FunctionCall &&
    proposal.status === 'Approved' &&
    !!accountId
  );
}

export const getImageFiles = async (
  url: string,
  name?: string
): Promise<File[]> => {
  const blob = await fetch(url).then(r => r.blob());

  const file = new File([blob], name || '');

  return [file];
};

export async function getInitialFormValuesFromDraft(
  variant: ProposalVariant,
  data: Record<string, unknown>,
  daoTokens: Record<string, Token>,
  accountId: string
): Promise<Record<string, unknown>> {
  const kind = data.kind as ProposalKind;

  const externalUrl = `${document.location?.origin}/dao/${data.daoId}/drafts/${data.id}`;

  switch (variant) {
    case ProposalVariant.ProposeGetUpgradeCode: {
      return {
        details: data.title,
        externalUrl,
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        versionHash: '',
      };
    }
    case ProposalVariant.ProposeUpdateGroup: {
      return {
        details: data.title,
        externalUrl,
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        groups: '',
      };
    }
    case ProposalVariant.ProposeUpgradeSelf: {
      return {
        details: data.title,
        externalUrl,
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        versionHash: '',
      };
    }
    case ProposalVariant.ProposeRemoveUpgradeCode: {
      return {
        details: data.title,
        externalUrl,
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        versionHash: '',
      };
    }
    case ProposalVariant.ProposeCreateDao: {
      return {
        details: data.title,
        externalUrl,
        gas: DEFAULT_CREATE_DAO_GAS,
        displayName: data.displayName,
      };
    }
    case ProposalVariant.ProposeTransferFunds: {
      const tokens = (daoTokens as Record<string, Token>) ?? {};
      const tokensIds = Object.values(tokens).map(item => item.symbol);

      const tokensFields = tokensIds.reduce<Record<string, string | null>>(
        (res, item) => {
          res[`${item}_amount`] = null;

          res[`${item}_target`] = data.target as string;

          return res;
        },
        {}
      );

      return {
        details: data.title,
        externalUrl,
        gas: DEFAULT_CREATE_DAO_GAS,
        daoTokens,
        ...tokensFields,
        ...data,
      };
    }
    case ProposalVariant.ProposeCreateBounty: {
      if (kind.type === ProposalType.AddBounty) {
        const bountyData = kind.bounty;

        return {
          details: data.title,
          externalUrl,
          token: daoTokens[bountyData.token]?.symbol ?? 'NEAR',
          amount: formatYoktoValue(
            bountyData.amount,
            daoTokens[bountyData.token]?.decimals
          ),
          slots: bountyData.times,
          deadlineThreshold: differenceInDays(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            toMillis(bountyData.maxDeadline),
            0
          ),
          deadlineUnits: 'days',
          gas: DEFAULT_PROPOSAL_GAS,
        };
      }

      return {};
    }
    case ProposalVariant.ProposeDoneBounty: {
      return {
        details: data.title,
        externalUrl,
        target: accountId,
        gas: DEFAULT_PROPOSAL_GAS,
        ...data,
      };
    }
    case ProposalVariant.ProposeTransfer: {
      if (kind.type === ProposalType.Transfer) {
        return {
          details: data.title,
          externalUrl,
          token: daoTokens[kind.tokenId]?.symbol ?? 'NEAR',
          amount: formatYoktoValue(
            kind.amount,
            daoTokens[kind.tokenId]?.decimals
          ),
          target: kind.receiverId,
          gas: DEFAULT_PROPOSAL_GAS,
        };
      }

      return {};
    }
    case ProposalVariant.ProposeChangeDaoName: {
      if (kind.type === ProposalType.ChangeConfig) {
        return {
          details: data.title,
          externalUrl,
          displayName: fromBase64ToMetadata(kind.config.metadata).displayName,
          gas: DEFAULT_PROPOSAL_GAS,
        };
      }

      return {};
    }
    case ProposalVariant.ProposeChangeDaoPurpose: {
      if (kind.type === ProposalType.ChangeConfig) {
        return {
          details: data.title,
          externalUrl,
          purpose: kind.config.purpose,
          gas: DEFAULT_PROPOSAL_GAS,
        };
      }

      return {};
    }
    case ProposalVariant.ProposeChangeDaoLinks: {
      if (kind.type === ProposalType.ChangeConfig) {
        return {
          details: data.title,
          externalUrl,
          gas: DEFAULT_PROPOSAL_GAS,
          links: fromBase64ToMetadata(kind.config.metadata).links,
        };
      }

      return {};
    }
    case ProposalVariant.ProposeCreateToken: {
      return {
        details: data.title,
        externalUrl,
        tokenName: '',
        totalSupply: '',
        tokenImage: '',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeUpdateVotePolicyToWeightVoting: {
      return {
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeStakingContractDeployment: {
      return {
        details: data.title,
        externalUrl,
        unstakingPeriod: '345',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeAcceptStakingContract: {
      return {
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeTokenDistribution: {
      return {
        details: data.title,
        externalUrl,
        groups: [],
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeChangeDaoLegalInfo: {
      if (kind.type === ProposalType.ChangeConfig) {
        const meta = kind.config.metadata
          ? fromBase64ToMetadata(kind.config.metadata)
          : null;

        const { legalLink, legalStatus } = meta?.legal || {};

        return {
          details: data.title,
          externalUrl,
          legalStatus,
          legalLink,
          gas: DEFAULT_PROPOSAL_GAS,
        };
      }

      return {};
    }
    case ProposalVariant.ProposePoll: {
      return {
        details: data.title,
        externalUrl,
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeAddMember: {
      if (kind.type === ProposalType.AddMemberToRole) {
        return {
          details: data.title,
          externalUrl,
          group: kind.role,
          memberName: kind.memberId,
          gas: DEFAULT_PROPOSAL_GAS,
        };
      }

      return {};
    }
    case ProposalVariant.ProposeRemoveMember: {
      if (kind.type === ProposalType.RemoveMemberFromRole) {
        return {
          details: data.title,
          externalUrl,
          group: kind.role,
          memberName: kind.memberId,
          gas: DEFAULT_PROPOSAL_GAS,
        };
      }

      return {};
    }
    case ProposalVariant.ProposeCreateGroup: {
      if (kind.type === ProposalType.ChangePolicy) {
        const proposalGroups = kind.policy.roles
          .map(item => ({
            ...item,
            createdAt: parseISO(item.createdAt),
          }))
          .sort((a, b) => {
            if (a.createdAt > b.createdAt) {
              return 1;
            }

            if (a.createdAt < b.createdAt) {
              return -1;
            }

            return 0;
          });

        const newGroup = proposalGroups[proposalGroups.length - 1];

        if (newGroup) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const memberName = newGroup?.kind?.group[0] ?? '';

          return {
            details: data.title,
            externalUrl,
            group: newGroup.name,
            memberName,
            gas: DEFAULT_PROPOSAL_GAS,
          };
        }

        return {};
      }

      return {};
    }
    case ProposalVariant.ProposeChangeVotingPolicy: {
      return {
        details: data.title,
        externalUrl,
        amount: data.amount,
        gas: DEFAULT_PROPOSAL_GAS,
        ...data,
      };
    }
    case ProposalVariant.ProposeChangeBonds: {
      if (kind.type === ProposalType.ChangePolicy) {
        return {
          details: data.title,
          externalUrl,
          createProposalBond: new Decimal(kind.policy.proposalBond)
            .div(YOKTO_NEAR)
            .toNumber(),
          claimBountyBond: new Decimal(kind.policy.bountyBond)
            .div(YOKTO_NEAR)
            .toNumber(),
          proposalExpireTime: new Decimal(kind.policy.proposalPeriod)
            .div('3.6e12')
            .toNumber(),
          unclaimBountyTime: new Decimal(kind.policy.bountyForgivenessPeriod)
            .div('3.6e12')
            .toNumber(),
          gas: DEFAULT_PROPOSAL_GAS,
        };
      }

      return {};
    }
    case ProposalVariant.ProposeChangeDaoFlag: {
      if (kind.type === ProposalType.ChangeConfig) {
        const meta = kind.config.metadata
          ? fromBase64ToMetadata(kind.config.metadata)
          : null;

        const cover = getAwsImageUrl(meta?.flagCover);
        const logo = getAwsImageUrl(meta?.flagLogo);

        const coverFiles = await getImageFiles(cover, 'cover');
        const logoFiles = await getImageFiles(logo, 'logo');

        return {
          details: data.title,
          externalUrl,
          flagCover: coverFiles,
          flagLogo: logoFiles,
          gas: DEFAULT_PROPOSAL_GAS,
        };
      }

      return {};
    }
    case ProposalVariant.ProposeCustomFunctionCall: {
      if (kind.type === ProposalType.FunctionCall) {
        try {
          const action = kind.actions[0];

          const json = JSON.parse(
            Buffer.from(action.args, 'base64').toString('utf-8')
          );

          return {
            details: data.title,
            externalUrl,
            smartContractAddress: kind.receiverId,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            methodName: action.methodName,
            json: JSON.stringify(json, null, 2),
            deposit: formatYoktoValue(action.deposit),
            token: 'NEAR',
            actionsGas: DEFAULT_PROPOSAL_GAS,
            gas: formatYoktoValue(action.gas),

            functionCallType: 'Custom',
            timeout: 24,
            timeoutGranularity: 'Hours',
          };
        } catch (e) {
          return {};
        }
      }

      return {};
    }
    case ProposalVariant.ProposeChangeProposalVotingPermissions:
    case ProposalVariant.ProposeChangeProposalCreationPermissions: {
      return {
        details: data.title,
        externalUrl,
        amount: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...data,
      };
    }
    default: {
      return {};
    }
  }
}

export function getProposalUpdatedDate(
  proposal: ProposalFeedItem
): string | null {
  try {
    if (!proposal.actions?.length) {
      return proposal.updatedAt;
    }

    const sortedActions = proposal.actions.sort((a, b) => {
      if (+a.timestamp > +b.timestamp) {
        return 1;
      }

      if (+a.timestamp < +b.timestamp) {
        return -1;
      }

      return 0;
    });

    const lastTimestamp = sortedActions[sortedActions.length - 1]?.timestamp;

    if (!lastTimestamp) {
      return proposal.updatedAt;
    }

    return new Date(+lastTimestamp / 1000000).toISOString();
  } catch (e) {
    console.error(`Failed to extract proposal updated date: ${proposal.id}`, e);

    return proposal.updatedAt;
  }
}

export function getProposalPermissions(
  proposal: ProposalFeedItem | BountyProposal,
  accountId: string
): {
  canApprove: boolean;
  canReject: boolean;
  canDelete: boolean;
  isCouncil: boolean;
} {
  const { dao, permissions } = proposal;

  if (permissions && Object.keys(permissions).length > 0) {
    return {
      ...permissions,
    };
  }

  if (!dao) {
    return {
      canApprove: false,
      canReject: false,
      canDelete: false,
      isCouncil: false,
    };
  }

  const isCouncil = !!dao.policy?.roles?.find(
    item =>
      item.name.toLowerCase() === 'council' &&
      item.accountIds?.includes(accountId)
  );

  const allowedToVoteOn = getAllowedProposalsToVote(accountId, dao);

  const isPermitted = allowedToVoteOn[proposal.kind.type];

  return {
    canApprove: isPermitted,
    canReject: isPermitted,
    canDelete: isPermitted,
    isCouncil,
  };
}
