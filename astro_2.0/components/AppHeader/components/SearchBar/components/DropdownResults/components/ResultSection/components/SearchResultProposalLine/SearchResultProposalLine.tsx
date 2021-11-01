import { VFC } from 'react';

import { Proposal } from 'types/proposal';

import styles from './SearchResultProposalLine.module.scss';

interface SearchResultProposalLineProps {
  data: Proposal;
  onClick: () => void;
}

export const SearchResultProposalLine: VFC<SearchResultProposalLineProps> = ({
  data,
  onClick,
}) => {
  const { description } = data;

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyPress={onClick}
      className={styles.root}
    >
      {description}
    </div>
  );
};
