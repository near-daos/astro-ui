import React, { FC, useCallback, useState } from 'react';
import { Badge } from 'components/badge/Badge';

import MemberCard, {
  GroupsRenderer,
  MemberCardPopup,
} from 'components/cards/member-card';
import { Dropdown } from 'components/Dropdown';
import { useModal } from 'components/modal';

import { useRouter } from 'next/router';

import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { extractMembersFromDao } from 'services/sputnik/mappers';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { NavLink } from 'astro_2.0/components/NavLink';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { Proposal, ProposalVariant } from 'types/proposal';
import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';
import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';
import { useAuthCheck } from 'astro_2.0/features/Auth';
import { GroupsList } from 'astro_2.0/features/Groups/components';
import useSortMembers from 'astro_2.0/features/Groups/hooks/useSortMembers';
import { DaoContext } from 'types/context';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { uniq } from 'lodash';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';
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
  daoContext: DaoContext;
  proposals: Proposal[];
}

const GroupPage: FC<GroupPageProps> = ({
  daoContext: {
    dao,
    policyAffectsProposals,
    userPermissions: { isCanCreateProposals },
  },
  proposals,
}) => {
  const { tokens } = useDaoCustomTokens();
  const members = dao ? extractMembersFromDao(dao, proposals) : [];

  const availableGroups = uniq(
    members.reduce<string[]>((res, item) => {
      res.push(...item.groups);

      return res;
    }, [])
  );
  const router = useRouter();
  const paramGroup = router.query.group as string;
  const group = groupMap[paramGroup] || paramGroup;

  const [activeSort, setActiveSort] = useState<string>(sortOptions[0].value);
  const sortedData = useSortMembers({ members, activeSort, group });

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();
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
        <NavLink href={`/dao/${dao.id}`}>{dao?.displayName || dao?.id}</NavLink>
        <NavLink href={`/dao/${dao.id}/groups/all-members`}>Groups</NavLink>
        <NavLink>{pageTitle === 'all' ? 'All Members' : pageTitle}</NavLink>
      </BreadCrumbs>
      <div className={styles.dao}>
        <DaoDetailsMinimized
          dao={dao}
          disableNewProposal={!isCanCreateProposals}
          onCreateProposalClick={handleCreateGroup}
        />
        <CreateProposal
          className={styles.createProposal}
          dao={dao}
          key={Object.keys(tokens).length}
          daoTokens={tokens}
          proposalVariant={ProposalVariant.ProposeCreateGroup}
          showFlag={false}
          onClose={toggleCreateProposal}
        />
        <PolicyAffectedWarning
          data={policyAffectsProposals}
          className={styles.warningWrapper}
        />
      </div>
      <div className={styles.header}>
        <h1>{pageTitle === 'all' ? 'All Members' : <>{pageTitle}</>}</h1>
      </div>
      <GroupsList
        className={styles.groups}
        groups={availableGroups}
        daoId={dao.id}
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
            onRemoveClick={isCanCreateProposals ? handleRemoveClick : undefined}
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
  req,
  query,
}) => {
  const daoId = query.dao as string;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const [daoContext, proposals] = await Promise.all([
    SputnikHttpService.getDaoContext(account, daoId),
    SputnikHttpService.getProposals(daoId),
  ]);

  if (!daoContext) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      daoContext,
      proposals,
    },
  };
};

export default GroupPage;
