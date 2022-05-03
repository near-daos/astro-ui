import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { VFC, useCallback } from 'react';
import { useWalletContext } from 'context/WalletContext';

import { SEARCH_PAGE_URL } from 'constants/routing';

import { useSearchResults } from 'features/search/search-results';
import { NoSearchResultsView } from 'features/search/search-results/components/NoSearchResultsView';

import {
  ResultSection,
  SearchResultDaoCard,
  SearchResultPeopleCard,
  SearchResultProposalLine,
} from './components/ResultSection';

import styles from './DropdownResults.module.scss';

interface DropdownResultsProps {
  width: number;
  closeSearch: () => void;
  query: string;
}

export const DropdownResults: VFC<DropdownResultsProps> = ({
  width,
  closeSearch,
  query,
}) => {
  const DAOS_TAB_IDNEX = 0;
  const PROPOSAL_TAB_INDEX = 1;
  const PEOPLE_TAB_INDEX = 2;

  const { accountId } = useWalletContext();
  const { t } = useTranslation('common');

  const router = useRouter();
  const { searchResults } = useSearchResults();

  const { daos, proposals, members } = searchResults || {};

  const goToSearchPage = useCallback(
    (tabIndex: number) => {
      router.push(
        {
          pathname: SEARCH_PAGE_URL,
          query: {
            ...router.query,
            tab: tabIndex,
          },
        },
        undefined,
        {
          shallow: true,
        }
      );
    },
    [router]
  );

  const goToDaosTabOnSearchPage = useCallback(() => {
    goToSearchPage(DAOS_TAB_IDNEX);
  }, [goToSearchPage]);

  const goToProposalsTabOnSearchPage = useCallback(() => {
    goToSearchPage(PROPOSAL_TAB_INDEX);
  }, [goToSearchPage]);

  const goToPeopleTabOnSearchPage = useCallback(() => {
    goToSearchPage(PEOPLE_TAB_INDEX);
  }, [goToSearchPage]);

  function renderNoResults() {
    if (
      isEmpty(daos) &&
      isEmpty(proposals) &&
      isEmpty(members) &&
      query !== ''
    ) {
      return <NoSearchResultsView query={query} />;
    }

    return null;
  }

  function getThreeFirstResults<T>(data?: T[]): T[] {
    return data?.slice(0, 3) || [];
  }

  function renderDaos() {
    const sorted =
      daos?.sort((a, b) => {
        if (a.accountIds.includes(accountId)) {
          return -1;
        }

        if (b.accountIds.includes(accountId)) {
          return 1;
        }

        return 0;
      }) ?? [];

    const dataToRender = getThreeFirstResults(sorted);

    return (
      <ResultSection
        data={sorted}
        title={t('header.search.daos')}
        onSeeAll={goToDaosTabOnSearchPage}
      >
        {dataToRender.map(dao => (
          <SearchResultDaoCard data={dao} key={dao.id} onClick={closeSearch} />
        ))}
      </ResultSection>
    );
  }

  function renderProposals() {
    const proposalsToRender = getThreeFirstResults(proposals);

    return (
      <ResultSection
        title={t('header.search.proposals')}
        data={proposals}
        onSeeAll={goToProposalsTabOnSearchPage}
        contentClassName={styles.proposalsContent}
      >
        {proposalsToRender.map(proposal => (
          <SearchResultProposalLine
            data={proposal}
            key={proposal.id}
            onClick={goToProposalsTabOnSearchPage}
          />
        ))}
      </ResultSection>
    );
  }

  function renderPeople() {
    const peopleToRender = getThreeFirstResults(members);

    return (
      <ResultSection
        title={t('header.search.people')}
        data={members}
        onSeeAll={goToPeopleTabOnSearchPage}
      >
        {peopleToRender.map(person => (
          <SearchResultPeopleCard
            data={person}
            key={person.id}
            onClick={goToPeopleTabOnSearchPage}
          />
        ))}
      </ResultSection>
    );
  }

  return (
    <div className={styles.root} style={{ width }}>
      {renderDaos()}
      {renderProposals()}
      {renderPeople()}

      {renderNoResults()}
    </div>
  );
};
