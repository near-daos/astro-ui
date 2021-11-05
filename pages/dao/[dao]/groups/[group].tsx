import React, { FC, useCallback, useState } from 'react';
import uniq from 'lodash/uniq';
import { Badge } from 'components/badge/Badge';
import { Button } from 'components/button/Button';

import MemberCard, {
  GroupsRenderer,
  MemberCardPopup,
} from 'components/cards/member-card';
import { Dropdown } from 'components/dropdown/Dropdown';
import { useModal } from 'components/modal';
import { GroupPopup } from 'features/groups';
import { GroupFormType } from 'features/groups/types';

import get from 'lodash/get';
import { useRouter } from 'next/router';

import { DAO, Member } from 'types/dao';
import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { extractMembersFromDao } from 'services/sputnik/mappers';
import { useAuthContext } from 'context/AuthContext';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import NavLink from 'astro_2.0/components/NavLink';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { ProposalVariant } from 'types/proposal';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';

import styles from './groups.module.scss';

const sortOptions = [
  {
    label: 'Most active',
    value: 'Most active',
  },
];

const groupMap: { [key: string]: string } = {
  'all-members': 'all',
};

interface GroupPageProps {
  dao: DAO;
  members: Member[];
  availableGroups: string[];
}

const GroupPage: FC<GroupPageProps> = ({ dao, members, availableGroups }) => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const paramGroup = router.query.group as string;
  const { accountId, login } = useAuthContext();

  const group = groupMap[paramGroup] || paramGroup;
  const [showCardModal] = useModal(MemberCardPopup);
  const [showGroupModal] = useModal(GroupPopup);

  const [activeSort, setActiveSort] = useState<string>(sortOptions[0].value);
  const [showCreateProposal, setShowCreateProposal] = useState(false);

  const showCreateGroupDialog = useCallback(async () => {
    await showGroupModal({
      initialValues: {
        groupType: GroupFormType.CREATE_GROUP,
        groups: [],
      },
    });
  }, [showGroupModal]);

  const handleCreateGroup = useCallback(
    () => (accountId ? showCreateGroupDialog() : login()),
    [login, showCreateGroupDialog, accountId]
  );

  const showAddMemberDialog = useCallback(async () => {
    await showGroupModal({
      initialValues: {
        groupType: GroupFormType.ADD_TO_GROUP,
        groups: availableGroups,
        selectedGroup: group,
      },
    });
  }, [availableGroups, group, showGroupModal]);

  const handleAddClick = useCallback(
    () => (accountId ? showAddMemberDialog() : login()),
    [login, showAddMemberDialog, accountId]
  );

  const showRemoveMemberDialog = useCallback(
    async item => {
      await showGroupModal({
        initialValues: {
          groups: item.groups,
          name: item.name,
          groupType: GroupFormType.REMOVE_FROM_GROUP,
          selectedGroup: group,
        },
      });
    },
    [group, showGroupModal]
  );

  const handleRemoveClick = useCallback(
    item => (accountId ? showRemoveMemberDialog(item) : login()),
    [login, showRemoveMemberDialog, accountId]
  );

  const handleCardClick = useCallback(
    async d => {
      await showCardModal(d);
    },
    [showCardModal]
  );

  const handleCreateProposal = useCallback(() => {
    setShowCreateProposal(true);
  }, []);

  const sortedData = members
    .filter(
      item =>
        !group ||
        group === 'all-members' ||
        group === 'all' ||
        item.groups
          .map(grp => grp.toLowerCase())
          .includes((group as string).replace('-', ' ').toLowerCase())
    )
    .sort((a, b) => {
      let sortField = '';

      if (activeSort === 'Most active') {
        sortField = 'votes';
      } else if (activeSort === '# of tokens') {
        sortField = 'tokens.value';
      }

      if (get(a, sortField) > get(b, sortField)) {
        return -1;
      }

      if (get(a, sortField) < get(b, sortField)) {
        return 1;
      }

      return 0;
    });

  const page = Array.isArray(group) ? group[0] : group;
  const pageTitle = page?.replace('-', ' ');

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/all/daos">All DAOs</NavLink>
        <NavLink href={`/dao/${daoId}`}>{dao?.displayName || dao?.id}</NavLink>
        <NavLink href={`/dao/${daoId}/groups/all-members`}>Groups</NavLink>
        <span>{pageTitle === 'all' ? 'All Members' : pageTitle}</span>
      </BreadCrumbs>

      <div className={styles.dao}>
        <DaoDetailsMinimized
          dao={dao}
          accountId={accountId}
          onCreateProposalClick={handleCreateProposal}
        />
        {showCreateProposal && (
          <div className={styles.newProposalWrapper}>
            <CreateProposal
              dao={dao}
              proposalVariant={ProposalVariant.ProposeTransfer}
              onCreate={isSuccess => {
                if (isSuccess) {
                  setShowCreateProposal(false);
                }
              }}
              onClose={() => {
                setShowCreateProposal(false);
              }}
            />
          </div>
        )}
      </div>

      <div className={styles.header}>
        <h1>{pageTitle === 'all' ? 'All Members' : <>{pageTitle}</>}</h1>
        <Button variant="black" size="small" onClick={handleCreateGroup}>
          Create new group
        </Button>
        <Button variant="black" size="small" onClick={handleAddClick}>
          Add member to this group
        </Button>
      </div>
      <div className={styles.groups}>
        <h5 className={styles.groupsTitle}>Groups</h5>
        <ul className={styles.groupsList}>
          {availableGroups.map(item => (
            <li className={styles.groupsItem}>
              <NavLink href={`/dao/${daoId}/groups/${item}`}>
                <Badge key={item} size="small" variant="turqoise">
                  {item}
                </Badge>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.filter}>
        <Dropdown
          options={sortOptions}
          value={activeSort}
          defaultValue={activeSort}
          onChange={value => setActiveSort(value ?? sortOptions[0].value)}
        />
      </div>
      <div className={styles.content}>
        {sortedData.map(item => (
          <MemberCard
            onRemoveClick={async () => {
              await handleRemoveClick(item);
            }}
            onClick={handleCardClick}
            key={item.name}
            title={item.name}
            votes={item.votes}
            tokens={item.tokens}
          >
            <GroupsRenderer
              selectedItems={item.groups.map((grp, i) => ({
                label: grp,
                component: (
                  <Badge
                    key={grp}
                    size="small"
                    variant={i % 2 > 0 ? 'turqoise' : 'blue'}
                  >
                    {grp}
                  </Badge>
                ),
              }))}
            />
          </MemberCard>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<GroupPageProps> = async ({
  query,
}) => {
  const daoId = query.dao as string;

  const [dao, proposals] = await Promise.all([
    SputnikHttpService.getDaoById(daoId),
    SputnikHttpService.getProposals(daoId),
  ]);

  if (!dao) {
    return {
      notFound: true,
    };
  }

  const members = dao ? extractMembersFromDao(dao, proposals) : [];

  const availableGroups = members.reduce<string[]>((res, item) => {
    res.push(...item.groups);

    return res;
  }, []);

  return {
    props: {
      dao,
      members,
      availableGroups: uniq(availableGroups),
    },
  };
};

export default GroupPage;
