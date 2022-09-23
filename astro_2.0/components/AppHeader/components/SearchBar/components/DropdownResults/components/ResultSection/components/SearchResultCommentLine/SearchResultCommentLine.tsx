import isEmpty from 'lodash/isEmpty';
import { ReactNode, VFC } from 'react';
import DOMPurify from 'dompurify';

import { ProposalComment } from 'types/proposal';

import { useSearchResults } from 'features/search/search-results';

import styles from './SearchResultCommentLine.module.scss';

interface Props {
  data: Pick<ProposalComment, 'message' | 'daoId' | 'contextId'>;
  onClick: (dao: string, proposalId: string) => void;
}

export const SearchResultCommentLine: VFC<Props> = ({ data, onClick }) => {
  const { searchResults } = useSearchResults();

  const query = searchResults?.query || '';
  const { message } = data;
  const title = DOMPurify.sanitize(message, { FORBID_TAGS: ['p'] });

  const reg = new RegExp(query, 'gi');
  const matchingParts = title.match(reg) || [];

  // Highlights search entries in a string
  const result = isEmpty(matchingParts)
    ? { res: title }
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
          str: title,
          res: [],
        }
      );

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={() => onClick(data.daoId, data.contextId)}
      onKeyPress={() => onClick(data.daoId, data.contextId)}
      className={styles.root}
    >
      {result.res}
    </div>
  );
};
