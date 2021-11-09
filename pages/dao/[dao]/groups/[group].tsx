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

import useToggleable from 'hooks/useToggleable';
import { useAuthCheck } from 'astro_2.0/features/Auth';
import { GroupsList } from 'astro_2.0/features/Groups/components';
import useSortMembers from 'astro_2.0/features/Groups/hooks/useSortMembers';
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
  const group = groupMap[paramGroup] || paramGroup;

  const { accountId } = useAuthContext();
  const [activeSort, setActiveSort] = useState<string>(sortOptions[0].value);
  const sortedData = useSortMembers({ members, activeSort, group });

  const [ToggleableCreateProposal, toggleCreateProposal] = useToggleable(
    CreateProposal
  );
  const [showCardModal] = useModal(MemberCardPopup);

  const showCreateProposal = useAuthCheck(
    (proposalVariant: ProposalVariant) => {
      toggleCreateProposal({ proposalVariant });
    },
    [toggleCreateProposal]
  );

  const handleCreateGroup = useCallback(
    () => showCreateProposal(ProposalVariant.ProposeCreateGroup),
    [showCreateProposal]
  );

  const handleAddClick = useCallback(
    () => showCreateProposal(ProposalVariant.ProposeAddMember),
    [showCreateProposal]
  );

  const handleRemoveClick = useCallback(
    () => showCreateProposal(ProposalVariant.ProposeRemoveMember),
    [showCreateProposal]
  );

  const handleCardClick = useCallback(
    async d => {
      await showCardModal(d);
    },
    [showCardModal]
  );

  const page = Array.isArray(group) ? group[0] : group;
  const pageTitle = page?.replace('-', ' ');

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/all/daos">All DAOs</NavLink>
        <NavLink href={`/dao/${daoId}`}>{dao?.displayName || dao?.id}</NavLink>
        <NavLink href={`/dao/${daoId}/groups/all-members`}>Groups</NavLink>
        <NavLink>{pageTitle === 'all' ? 'All Members' : pageTitle}</NavLink>
      </BreadCrumbs>
      <div className={styles.dao}>
        <DaoDetailsMinimized
          dao={dao}
          accountId={accountId}
          onCreateProposalClick={handleCreateGroup}
        />
        <ToggleableCreateProposal
          dao={dao}
          showFlag={false}
          onCreate={isSuccess => isSuccess && toggleCreateProposal()}
          onClose={toggleCreateProposal}
        />
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
      <GroupsList
        className={styles.groups}
        groups={availableGroups}
        daoId={daoId}
      />
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
            onRemoveClick={handleRemoveClick}
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
