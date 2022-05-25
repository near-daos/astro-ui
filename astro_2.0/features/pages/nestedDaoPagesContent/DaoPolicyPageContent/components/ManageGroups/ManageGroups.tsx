import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { DAO, DaoVotePolicy, TGroup } from 'types/dao';
import { ProposalVariant } from 'types/proposal';

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
  votePolicy: DaoVotePolicy;
};

export const ManageGroups: React.FC<Props> = ({
  dao,
  handleCreateProposal,
  disableNewProposal,
}) => {
  const [groups, setGroups] = useState<TLocalGroup[]>([]);
  const [activeGroupSlug, setActiveGroupSlug] = useState(dao.groups[0].slug);

  useEffect(() => {
    setGroups(
      dao.groups.map(group => ({
        ...group,
        hasChanges: false,
        votePolicy:
          group.votePolicy?.ChangePolicy || dao.policy.defaultVotePolicy,
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

  const handleDeleteGroup = () => {
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
                votePolicy:
                  oldGroup.votePolicy?.ChangePolicy ||
                  dao.policy.defaultVotePolicy,
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
    if (groups.find(group => group.slug === 'new_group')) {
      setActiveGroupSlug('new_group');

      return;
    }

    const newGroup = {
      members: [],
      name: 'New Group',
      permissions: [],
      slug: 'new_group',
      votePolicy: {
        kind: 'Ratio',
        quorum: '1',
        ratio: [1, 2],
        weightKind: 'RoleWeight',
        weight: '',
      },
      hasChanges: true,
    };

    setActiveGroupSlug(newGroup.slug);

    setGroups([...groups, newGroup]);
  };

  const handleOnSubmit = () => {
    handleCreateProposal(ProposalVariant.ProposeUpdateGroup, { groups });
  };

  const activeGroup = groups.find(group => group.slug === activeGroupSlug);

  const modifiedGroups = groups.reduce(
    (count, group) => (group.hasChanges ? count + 1 : count),
    0
  );

  return (
    <>
      <div className={styles.root}>
        <div className={styles.list}>
          <Button
            variant="tertiary"
            className={styles.createGroup}
            onClick={handleCreateNewGroup}
          >
            <Icon name="buttonAddGroup" />
            Create new group
          </Button>

          <h4 className={styles.title}>Groups</h4>

          {groups.map(group => (
            <Button
              key={group.slug}
              variant="transparent"
              className={cn(styles.group, {
                [styles.groupActive]: group.slug === activeGroup?.slug,
                [styles.hasChanges]: group.hasChanges,
              })}
              onClick={() => handleSelectGroup(group)}
            >
              {group.name}
            </Button>
          ))}
        </div>

        {activeGroup && (
          <EditGroup
            group={activeGroup}
            onChange={handleUpdateGroup}
            onReset={handleResetGroupUpdates}
            onDelete={handleDeleteGroup}
          />
        )}
      </div>

      <Button
        variant="primary"
        className={cn(styles.submit, {
          [styles.submitVisible]: modifiedGroups > 0,
        })}
        disabled={disableNewProposal}
        onClick={handleOnSubmit}
      >
        {modifiedGroups > 1
          ? `Propose changes to ${modifiedGroups} groups`
          : 'Propose changes'}
      </Button>
    </>
  );
};
