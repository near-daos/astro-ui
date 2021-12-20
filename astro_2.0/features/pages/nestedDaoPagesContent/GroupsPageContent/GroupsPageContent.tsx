import uniq from 'lodash/uniq';
import { useRouter } from 'next/router';
import React, { VFC, useState, useCallback } from 'react';

// Types
import { DaoContext } from 'types/context';
import { Proposal, ProposalVariant } from 'types/proposal';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';

// Hooks
import { useModal } from 'components/modal/hooks';
import { useAuthCheck } from 'astro_2.0/features/Auth';
import { useSortMembers } from 'astro_2.0/features/Groups/hooks/useSortMembers';

// Components
import MemberCard, {
  GroupsRenderer,
  MemberCardPopup,
} from 'components/cards/member-card';
import { Dropdown } from 'components/Dropdown';
import { Badge } from 'components/badge/Badge';
import { GroupsList } from 'astro_2.0/features/Groups/components';

// Helpers
import { extractMembersFromDao } from 'services/sputnik/mappers';

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
  proposals: Proposal[];
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const GroupsPageContent: VFC<GroupsPageContentProps> = ({
  pageTitle,
  daoContext,
  proposals,
  toggleCreateProposal,
}) => {
  const {
    dao,
    userPermissions: { isCanCreateProposals },
  } = daoContext;

  const members = dao ? extractMembersFromDao(dao, proposals) : [];

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
