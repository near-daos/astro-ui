import React, { FC } from 'react';

import { Button } from 'components/button/Button';

import { OPEN_SEARCH_INDEX as INDEX } from 'services/SearchService/constants';

import styles from 'astro_2.0/components/AppHeader/components/SearchBar/SearchBar.module.scss';

interface Props {
  value: string;
  visible: boolean;
  onSelect: (val: string) => void;
}

const LEGEND = [
  {
    char: '+',
    desc: 'Acts as the AND operator',
  },
  {
    char: '|',
    desc: 'Acts as the OR operator',
  },
  {
    char: '*',
    desc: 'Acts as a wildcard',
  },
  {
    char: '""',
    desc: 'Wraps several terms into a phrase',
  },
  {
    char: '-',
    desc: 'Negates the term',
  },
];

function getSuggestionLabel(item: keyof typeof INDEX) {
  switch (item) {
    case 'dao': {
      return 'DAOs';
    }
    // case 'comment': {
    //   return 'Comments';
    // }
    case 'proposal': {
      return 'Proposals';
    }
    case 'draftproposal': {
      return 'Draft proposals';
    }
    default: {
      return '';
    }
  }
}

export const SearchHints: FC<Props> = ({ value, visible, onSelect }) => {
  if (typeof document === 'undefined' || !visible || value === undefined) {
    return null;
  }

  const [indexSearchPart, fieldSearchPart, valueSearchPart] = value.split(':');

  let content = null;
  let title = null;

  if (!indexSearchPart || value.indexOf(':') === -1) {
    const suggestions = Object.keys(INDEX).filter(item =>
      item.startsWith(value)
    );

    if (suggestions.length) {
      title = <span>Search for</span>;
      content = suggestions.map(item => {
        return (
          <Button
            variant="tertiary"
            size="small"
            capitalize
            className={styles.hintButton}
            key={item}
            onClick={() => {
              onSelect(`${item}:`);
            }}
          >
            {getSuggestionLabel(item as keyof typeof INDEX)}
          </Button>
        );
      });
    }
  } else if (!fieldSearchPart || value.indexOf(`${fieldSearchPart}:`) === -1) {
    const fields = INDEX[indexSearchPart as keyof typeof INDEX];

    const suggestions = fields?.filter(item =>
      item.startsWith(fieldSearchPart)
    );

    if (suggestions?.length) {
      title = (
        <span>
          Search for <strong>{indexSearchPart}</strong> by
        </span>
      );
      content = suggestions.map(item => {
        return (
          <Button
            variant="tertiary"
            size="small"
            capitalize
            className={styles.hintButton}
            key={item}
            onClick={() => {
              onSelect(`${indexSearchPart}:${item}:`);
            }}
          >
            {item}
          </Button>
        );
      });
    }
  } else if (indexSearchPart && fieldSearchPart && valueSearchPart) {
    title = (
      <span>
        Search for <strong>{indexSearchPart}</strong> by{' '}
        <strong>{fieldSearchPart}</strong> equal to{' '}
        <strong>{valueSearchPart}</strong>
      </span>
    );
  } else if (indexSearchPart && fieldSearchPart) {
    title = (
      <span>
        Search for <strong>{indexSearchPart}</strong> by{' '}
        <strong>{fieldSearchPart}</strong>
      </span>
    );
  }

  if (title) {
    return (
      <div className={styles.hint}>
        <div className={styles.hintTitle}>{title}</div>
        {content}
        <div className={styles.legend}>
          <div className={styles.legendTitle}>
            You can use special characters to specify search options
          </div>
          {LEGEND.map(item => {
            return (
              <div key={item.char} className={styles.legendItem}>
                <div>{item.char}</div>
                <div>{item.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
