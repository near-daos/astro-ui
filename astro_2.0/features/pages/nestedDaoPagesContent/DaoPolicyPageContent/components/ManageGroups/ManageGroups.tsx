// TODO requires localisation

import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

import { useWalletContext } from 'context/WalletContext';

import { DAO, DaoVotePolicy, TGroup } from 'types/dao';
import { ProposalVariant } from 'types/proposal';
import { WalletType } from 'types/config';

import { formatPolicyRatio } from 'features/vote-policy/helpers';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { GA_EVENTS, sendGAEvent } from 'utils/ga';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import { EditGroup } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/components/ManageGroups/components/EditGroup';

import styles from './ManageGroups.module.scss';

type Props = {
  dao: DAO;
  disableNewProposal: boolean;
  handleCreateProposal: (
    proposalVariant: ProposalVariant,
    initialValues?: Record<string, unknown>
  ) => void;
};

type TLocalGroup = Omit<TGroup, 'votePolicy'> & {
  hasChanges: boolean;
  isCreated: boolean;
  votePolicy: DaoVotePolicy;
};

export const ManageGroups: React.FC<Props> = ({
  dao,
  handleCreateProposal,
  disableNewProposal,
}) => {
  const { t } = useTranslation();
  const { currentWallet, accountId } = useWalletContext();

  const [groups, setGroups] = useState<TLocalGroup[]>([]);
  const [activeGroupSlug, setActiveGroupSlug] = useState<string>(
    dao.groups[0].slug
  );

  useEffect(() => {
    setGroups(
      dao.groups.map(group => ({
        ...group,
        hasChanges: false,
        isCreated: false,
        votePolicy: group.votePolicy?.policy
          ? {
              ...group.votePolicy?.policy,
              quorum: formatPolicyRatio(group.votePolicy?.policy).toString(),
            }
          : {
              ...dao.policy.defaultVotePolicy,
              quorum: formatPolicyRatio(
                dao.policy.defaultVotePolicy
              ).toString(),
            },
      }))
    );
  }, [dao.groups, dao.policy.defaultVotePolicy]);

  const handleSelectGroup = (group: TLocalGroup) => {
    setActiveGroupSlug(group.slug);
  };

  const handleUpdateGroup = (updatedGroup: TLocalGroup) =>
    setGroups(
      groups.map(group =>
        group.slug === activeGroupSlug
          ? { ...updatedGroup, hasChanges: true }
          : group
      )
    );

  const isWalletSupportAmount = (): boolean => {
    if (currentWallet === WalletType.NEAR) {
      return groups.length < 9;
    }

    return true;
  };

  const validateGroup = (
    group: TLocalGroup
  ): { hasError: boolean; message: string } => {
    if (
      groups.find(item => item.name === group.name && item.slug !== group.slug)
    ) {
      return { hasError: true, message: 'Group name should be unique' };
    }

    if (group.name.trim() === '') {
      return { hasError: true, message: 'Add group name' };
    }

    if (group.members.length === 0) {
      return { hasError: true, message: 'Group requires at least one member' };
    }

    return { hasError: false, message: '' };
  };

  const handleDeleteGroup = () => {
    const filledGroupSlugs = groups
      .filter(group => group.members.length > 0)
      .map(group => group.slug);

    if (
      filledGroupSlugs.includes(activeGroupSlug) &&
      filledGroupSlugs.length === 1
    ) {
      showNotification({
        type: NOTIFICATION_TYPES.ERROR,
        description: t('manageGroups.preventDeleteLastGroupWithMembers'),
        lifetime: 10000,
      });

      return;
    }

    const filteredGroups = groups.filter(
      group => group.slug !== activeGroupSlug
    );

    setGroups(filteredGroups);

    setActiveGroupSlug(filteredGroups[0].slug);
  };

  const handleResetGroupUpdates = () => {
    if (dao.groups.find(g => g.slug === activeGroupSlug)) {
      setGroups(
        groups
          .map(group => {
            if (group.slug === activeGroupSlug) {
              const oldGroup = dao.groups.find(
                g => g.slug === activeGroupSlug
              ) as TGroup;

              return {
                ...oldGroup,
                hasChanges: false,
                isCreated: group.isCreated,
                votePolicy: oldGroup.votePolicy?.ChangePolicy
                  ? {
                      ...oldGroup.votePolicy?.ChangePolicy,
                      quorum: formatPolicyRatio(
                        oldGroup.votePolicy?.ChangePolicy
                      ).toString(),
                    }
                  : {
                      ...dao.policy.defaultVotePolicy,
                      quorum: formatPolicyRatio(
                        dao.policy.defaultVotePolicy
                      ).toString(),
                    },
              };
            }

            return group;
          })
          .filter(g => !!g)
      );

      setActiveGroupSlug(groups[0].slug || '');
    } else {
      handleDeleteGroup();
    }
  };

  const handleCreateNewGroup = () => {
    const newGroup = {
      members: [],
      name: '',
      permissions: [],
      slug: `new_group_${Date.now()}`,
      votePolicy: {
        kind: 'Ratio',
        quorum: '50',
        ratio: [1, 2],
        weightKind: 'RoleWeight',
        weight: '',
      },
      hasChanges: true,
      isCreated: true,
    };

    setActiveGroupSlug(newGroup.slug);

    setGroups([...groups, newGroup]);
  };

  const handleOnSubmit = () => {
    if (!isWalletSupportAmount()) {
      showNotification({
        type: NOTIFICATION_TYPES.ERROR,
        description:
          "Near wallet doesn't support so large request. Please, use Sender wallet instead!",
        lifetime: 10000,
      });

      sendGAEvent({
        name: GA_EVENTS.GROUP_BULK_UPDATE_INVALID_WALLET,
        daoId: dao.id,
        accountId,
      });

      return;
    }

    handleCreateProposal(ProposalVariant.ProposeUpdateGroup, {
      groups: groups.map(group => ({
        ...group,
        votePolicy: {
          ...group.votePolicy,
          ratio: [group.votePolicy.quorum, 100],
        },
      })),
    });
  };

  const activeGroup = groups.find(group => group.slug === activeGroupSlug);

  const modifiedGroups = groups.reduce(
    (count, group) => (group.hasChanges ? count + 1 : count),
    0
  );

  const isGroupsValid = () =>
    groups.reduce(
      (isValid, group) => isValid && !validateGroup(group).hasError,
      true
    );

  return (
    <>
      <div className={styles.root}>
        <div className={styles.list}>
          <Button
            variant="tertiary"
            className={styles.createGroup}
            onClick={handleCreateNewGroup}
            disabled={disableNewProposal}
          >
            <Icon name="buttonAddGroup" />
            Create new group
          </Button>

          <h4 className={styles.title}>Groups</h4>

          {groups.map(group => {
            const validation = validateGroup(group);

            return (
              <Button
                key={group.slug}
                variant="transparent"
                className={cn(styles.group, {
                  [styles.groupActive]: group.slug === activeGroup?.slug,
                  [styles.hasChanges]: group.hasChanges && !validation.hasError,
                  [styles.hasError]: validation.hasError,
                })}
                onClick={() => handleSelectGroup(group)}
              >
                <span>{group.name}</span>

                {validation.hasError && (
                  <Tooltip
                    overlay={<span>{validation.message}</span>}
                    className={styles.label}
                  >
                    <Icon name="stateAlert" className={styles.groupIcon} />
                  </Tooltip>
                )}
              </Button>
            );
          })}
        </div>

        {activeGroup && (
          <EditGroup
            groupsNames={groups.map(group => group.name.toLowerCase())}
            group={activeGroup}
            onChange={handleUpdateGroup}
            onReset={handleResetGroupUpdates}
            onDelete={handleDeleteGroup}
            disabled={disableNewProposal}
          />
        )}
      </div>

      <Button
        variant="primary"
        className={cn(styles.submit, {
          [styles.submitVisible]:
            modifiedGroups > 0 || dao.groups.length - groups.length > 0,
        })}
        disabled={disableNewProposal || !isGroupsValid()}
        onClick={handleOnSubmit}
      >
        {modifiedGroups > 1
          ? `Propose changes to ${modifiedGroups} groups`
          : 'Propose changes'}
      </Button>
    </>
  );
};
