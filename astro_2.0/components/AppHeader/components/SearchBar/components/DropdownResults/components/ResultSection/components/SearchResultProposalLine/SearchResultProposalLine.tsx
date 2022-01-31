import isEmpty from 'lodash/isEmpty';
import { ReactNode, VFC } from 'react';

import { Proposal } from 'types/proposal';

import { useSearchResults } from 'features/search/search-results';

import styles from './SearchResultProposalLine.module.scss';

interface SearchResultProposalLineProps {
  data: Pick<Proposal, 'description'>;
  onClick: () => void;
}

export const SearchResultProposalLine: VFC<SearchResultProposalLineProps> = ({
  data,
  onClick,
}) => {
  const { searchResults } = useSearchResults();

  const query = searchResults?.query || '';
  const { description } = data;

  const reg = new RegExp(query, 'gi');
  const matchingParts = description.match(reg) || [];

  // Highlights search entries in a string
  const result = isEmpty(matchingParts)
    ? { res: description }
    : matchingParts.reduce(
        (acc: { str: string; res: ReactNode[] }, part, index) => {
          const partIndex = acc.str.indexOf(part);

          if (partIndex > 0) {
            const portion = acc.str.slice(0, partIndex);

            acc.res.push(portion);
            acc.str = acc.str.replace(portion, '');
          }

          // eslint-disable-next-line react/no-array-index-key
          acc.res.push(<b key={`part-${index}`}>{part}</b>);
          acc.str = acc.str.replace(part, '');

          if (index === matchingParts.length - 1) {
            acc.res.push(acc.str);
          }

          return acc;
        },
        {
          str: description,
          res: [],
        }
      );

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyPress={onClick}
      className={styles.root}
    >
      {result.res}
    </div>
  );
};
