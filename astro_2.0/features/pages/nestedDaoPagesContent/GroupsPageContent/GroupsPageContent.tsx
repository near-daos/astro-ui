import uniq from 'lodash/uniq';
import { useRouter } from 'next/router';
import React, { VFC, useState, useCallback } from 'react';

// Types
import { DaoContext } from 'types/context';
import { ProposalType, ProposalVariant } from 'types/proposal';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';

// Hooks
import { useModal } from 'components/modal/hooks';
import { useAuthCheck } from 'astro_2.0/features/Auth';
import { useSortMembers } from 'astro_2.0/features/Groups/hooks/useSortMembers';
import {
  useDelegatePageData,
  useVotingPolicyDetails,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/hooks';

// Components
import MemberCard from 'components/cards/member-card/MemberCard/MemberCard';
import { GroupsRenderer } from 'components/cards/member-card/GroupsRenderer';
import { MemberCardPopup } from 'components/cards/member-card/MemberCardPopup';
import { Dropdown } from 'components/Dropdown';
import { Badge, getBadgeVariant } from 'components/Badge';
import { GroupsList } from 'astro_2.0/features/Groups/components';

// Helpers
import { MemberStats } from 'services/sputnik/mappers';
import { getActiveTokenHolders } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/helpers';
import { extractMembersFromDao } from 'astro_2.0/features/CreateProposal/helpers';

import styles from './GroupsPageContent.module.scss';

const sortOptions = [
  {
    label: 'Most active',
    value: 'Most active',
  },
];

interface GroupsPageContentProps {
  pageTitle: string;
  daoContext: DaoContext;
  membersStats: MemberStats[];
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const GroupsPageContent: VFC<GroupsPageContentProps> = ({
  pageTitle,
  daoContext,
  membersStats,
  toggleCreateProposal,
}) => {
  const {
    dao,
    userPermissions: { isCanCreateProposals, allowedProposalsToCreate },
  } = daoContext;

  const { data: delegations } = useDelegatePageData(daoContext.dao);
  const { balance } = useVotingPolicyDetails(daoContext.dao);
  const activeTokenHolders = getActiveTokenHolders(delegations, balance);

  const members = dao
    ? extractMembersFromDao(dao, membersStats, activeTokenHolders)
    : [];

  const availableGroups = uniq(
    members.reduce<string[]>((res, item) => {
      res.push(...item.groups);

      return res;
    }, [])
  );
  const router = useRouter();
  const group = router.query.group as string;

  const [activeSort, setActiveSort] = useState<string>(sortOptions[0].value);
  const sortedData = useSortMembers({ members, activeSort, group });

  const [showCardModal] = useModal(MemberCardPopup);

  const showCreateProposal = useAuthCheck(
    (proposalVariant: ProposalVariant) => {
      if (toggleCreateProposal) {
        toggleCreateProposal({ proposalVariant });
      }
    },
    [toggleCreateProposal]
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

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>{pageTitle}</h1>
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
            onRemoveClick={
              isCanCreateProposals &&
              allowedProposalsToCreate[ProposalType.RemoveMemberFromRole] &&
              !(item.groups.length === 1 && item.groups[0] === 'TokenHolders')
                ? handleRemoveClick
                : undefined
            }
            onClick={handleCardClick}
            key={item.name}
            title={item.name}
            votes={item.votes}
            tokens={item.tokens}
          >
            <GroupsRenderer
              selectedItems={item.groups.map(grp => ({
                label: grp,
                component: (
                  <Badge key={grp} size="small" variant={getBadgeVariant(grp)}>
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
