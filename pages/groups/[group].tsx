import React, { FC, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import get from 'lodash.get';

import { Button } from 'components/button/Button';
import { Dropdown } from 'components/dropdown/Dropdown';
import MemberCard, { MemberCardPopup } from 'components/cards/member-card';
import { Badge, Variant } from 'components/badge/Badge';
import { GroupPopup } from 'features/groups';
import { GroupFormInput, GroupFormType } from 'features/groups/types';

import { useModal } from 'components/modal';

import { groupColor, members, groupPopupData } from 'pages/groups/mockData';

import styles from './groups.module.scss';

const sortOptions = [
  {
    label: 'Most active',
    value: 'Most active'
  },
  {
    label: '# of tokens',
    value: '# of tokens'
  }
];

const GroupPage: FC = () => {
  const router = useRouter();
  const { group } = router.query;
  const [showCardModal] = useModal(MemberCardPopup);
  const [showGroupModal] = useModal(GroupPopup);

  const [activeSort, setActiveSort] = useState<string>(sortOptions[0].value);

  const handleAddClick = useCallback(async () => {
    // todo - where cna we get these initial values?
    await showGroupModal({
      initialValues: {
        ...(groupPopupData.initialValues as GroupFormInput),
        groupType: GroupFormType.ADD_TO_GROUP
      }
    });
  }, [showGroupModal]);

  const handleRemoveClick = useCallback(
    async item => {
      await showGroupModal({
        initialValues: {
          ...(groupPopupData.initialValues as GroupFormInput),
          groups: item.groups,
          name: item.name,
          groupType: GroupFormType.REMOVE_FROM_GROUP
        }
      });
    },
    [showGroupModal]
  );

  const handleCardClick = useCallback(
    async d => {
      await showCardModal(d);
    },
    [showCardModal]
  );

  // Todo - we will fetch and select members dynamically
  const data = members
    .filter(
      item =>
        !group ||
        group === 'all-members' ||
        item.groups
          .map(grp => grp.toLowerCase())
          .includes((group as string).replace('-', ' '))
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

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>All members</h1>
        <Button size="small" variant="secondary" onClick={handleAddClick}>
          Add member to this group
        </Button>
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
        {data.map(item => (
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
            {item.groups.map(grp => (
              <Badge
                key={grp}
                size="small"
                variant={groupColor[grp] as Variant}
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

export default GroupPage;
