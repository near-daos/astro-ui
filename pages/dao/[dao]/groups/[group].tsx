import uniq from 'lodash/uniq';
import { Badge } from 'components/badge/Badge';
import { Button } from 'components/button/Button';

import MemberCard, { MemberCardPopup } from 'components/cards/member-card';
import { Dropdown } from 'components/dropdown/Dropdown';
import { useModal } from 'components/modal';
import { GroupPopup } from 'features/groups';
import { GroupFormType } from 'features/groups/types';

import get from 'lodash/get';
import { useRouter } from 'next/router';

import styles from 'pages/dao/[dao]/groups/groups.module.scss';
import React, { FC, useCallback, useState } from 'react';

import { DAO, Member } from 'types/dao';
import { GetServerSideProps } from 'next';
import { SputnikService } from 'services/SputnikService';
import { extractMembersFromDao } from 'services/SputnikService/mappers/search-results';

const sortOptions = [
  {
    label: 'Most active',
    value: 'Most active'
  }
];

const groupMap: { [key: string]: string } = {
  'all-members': 'all'
};

interface GroupPageProps {
  dao: DAO;
  members: Member[];
  availableGroups: string[];
}

const GroupPage: FC<GroupPageProps> = ({ members, availableGroups }) => {
  const router = useRouter();
  const paramGroup = router.query.group as string;

  const group = groupMap[paramGroup] || paramGroup;
  const [showCardModal] = useModal(MemberCardPopup);
  const [showGroupModal] = useModal(GroupPopup);

  const [activeSort, setActiveSort] = useState<string>(sortOptions[0].value);

  const handleCreateGroup = useCallback(async () => {
    await showGroupModal({
      initialValues: {
        groupType: GroupFormType.CREATE_GROUP,
        groups: []
      }
    });
  }, [showGroupModal]);

  const handleAddClick = useCallback(async () => {
    await showGroupModal({
      initialValues: {
        groupType: GroupFormType.ADD_TO_GROUP,
        groups: availableGroups,
        selectedGroup: group
      }
    });
  }, [availableGroups, group, showGroupModal]);

  const handleRemoveClick = useCallback(
    async item => {
      await showGroupModal({
        initialValues: {
          groups: item.groups,
          name: item.name,
          groupType: GroupFormType.REMOVE_FROM_GROUP,
          selectedGroup: group
        }
      });
    },
    [group, showGroupModal]
  );

  const handleCardClick = useCallback(
    async d => {
      await showCardModal(d);
    },
    [showCardModal]
  );

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
      <div className={styles.header}>
        <h1>{pageTitle === 'all' ? 'All Members' : <>{pageTitle}</>}</h1>
        {pageTitle === 'all' ? (
          <Button variant="black" size="small" onClick={handleCreateGroup}>
            Create new group
          </Button>
        ) : (
          <Button variant="black" size="small" onClick={handleAddClick}>
            Add member to this group
          </Button>
        )}
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
            {item.groups.map((grp, i) => (
              <Badge
                key={grp}
                size="small"
                variant={i % 2 > 0 ? 'turqoise' : 'blue'}
              >
                {grp}
              </Badge>
            ))}
          </MemberCard>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query
}): Promise<{
  props: { dao: DAO | null; members: Member[]; availableGroups: string[] };
}> => {
  const dao = await SputnikService.getDaoById(query.dao as string);

  const members = await SputnikService.getProposals(query.dao as string).then(
    res => {
      return dao ? extractMembersFromDao(dao, res) : [];
    }
  );

  const availableGroups = members.reduce((res, item) => {
    res.push(...item.groups);

    return res;
  }, [] as string[]);

  return {
    props: {
      dao,
      members,
      availableGroups: uniq(availableGroups)
    }
  };
};

export default GroupPage;
