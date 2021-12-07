import cn from 'classnames';
import { VFC } from 'react';

import { Member } from 'types/dao';
import { NearIcon } from 'astro_2.0/components/NearIcon';

import styles from './SearchResultPeopleCard.module.scss';

interface SearchResultPeopleCard {
  data: Member;
  onClick: () => void;
}

export const SearchResultPeopleCard: VFC<SearchResultPeopleCard> = ({
  data,
  onClick,
}) => {
  const { name } = data;

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyPress={onClick}
      className={cn(styles.root, 'near-icon-parent')}
    >
      <NearIcon className={styles.icon} />
      {name}
    </div>
  );
};
