import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { GetServerSideProps, NextPage } from 'next';
import { useAsync } from 'react-use';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Icon } from 'components/Icon';
import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import StatusFilters from 'astro_2.0/components/Feed/StatusFilters';
import { DaoDetails } from 'astro_2.0/components/DaoDetails';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';
import CategoriesList from 'astro_2.0/components/Feed/CategoriesList';
import { NoResultsView } from 'features/no-results-view';
import { getActiveProposalsCountByDao } from 'hooks/useAllProposals';

import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { ProposalsQueries } from 'services/sputnik/types/proposals';

import {
  FeedCategories,
  Proposal,
  ProposalStatuses,
  ProposalVariant,
} from 'types/proposal';
import { DAO } from 'types/dao';
import { Token } from 'types/token';

import { useAuthContext } from 'context/AuthContext';
import { useCustomTokensContext } from 'context/CustomTokensContext';

import styles from './dao-home-page.module.scss';

interface DaoHomeProps {
  dao: DAO;
  proposals: Proposal[];
  tokens: Token[];
  proposalsTotal: number;
}

const DAOHome: NextPage<DaoHomeProps> = ({
  dao,
  proposals,
  tokens,
  proposalsTotal,
}) => {
  const router = useRouter();
  const { category, status } = router.query as ProposalsQueries;

  const { accountId } = useAuthContext();
  const { setTokens } = useCustomTokensContext();

  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [data, setData] = useState(proposals);
  const [hasMore, setHasMore] = useState(proposals.length !== proposalsTotal);

  useEffect(() => {
    setTokens(tokens);
  }, [tokens, setTokens]);

  const getMoreData = async () => {
    const res = await SputnikHttpService.getProposalsList({
      offset: data.length || 0,
      limit: LIST_LIMIT_DEFAULT,
      daoViewFilter: dao.name,
      category,
      status,
    });

    if (data.length + res.data.length === res.total) {
      setHasMore(false);
    }

    setData(existingData => [...existingData, ...res.data]);
  };

  const onProposalFilterChange = (value?: string) => async () => {
    const nextQuery = {
      ...router.query,
      status: value,
    } as ProposalsQueries;

    if (!value) {
      delete nextQuery.status;
    }

    await router.replace(
      {
        query: nextQuery,
      },
      undefined,
      { shallow: true, scroll: false }
    );
  };

  useAsync(async () => {
    const res = await SputnikHttpService.getProposalsList({
      offset: 0,
      limit: LIST_LIMIT_DEFAULT,
      daoViewFilter: dao.name,
      category: router.query.category as FeedCategories,
      status: router.query.status as ProposalStatuses,
    });

    setHasMore(res.data.length !== res.total);
    setData(res.data);
  }, [dao.name, router.query]);

  function renderDaoDetails() {
    const { active, total } = getActiveProposalsCountByDao(proposals);

    return (
      <div className={styles.daoDetails}>
        <DaoDetails
          dao={dao}
          accountId={accountId}
          onCreateProposalClick={() => setShowCreateProposal(true)}
          activeProposals={active[dao.id] || 0}
          totalProposals={total[dao.id] || 0}
        />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.breadcrumb}>
        <Link passHref href="/all/daos">
          <a href="*" className={styles.link}>
            <span className={styles.daoName}>All DAOs</span>
          </a>
        </Link>
        <span>
          <Icon name="buttonArrowRight" width={16} />
        </span>
        <span className={styles.activeLink}>{dao.name || dao.id}</span>
      </div>

      {renderDaoDetails()}

      {showCreateProposal && (
        <CreateProposal
          dao={dao}
          proposalVariant={ProposalVariant.ProposeTransfer}
          onCreate={isSuccess => {
            if (isSuccess) {
              setShowCreateProposal(false);
            }
          }}
          onClose={() => {
            setShowCreateProposal(false);
          }}
        />
      )}

      <div className={styles.statusFilterWrapper}>
        <StatusFilters
          proposal={status}
          onChange={onProposalFilterChange}
          list={[
            { value: undefined, label: 'All', name: 'All' },
            {
              value: ProposalStatuses.Active,
              label: 'Active',
              name: ProposalStatuses.Active,
            },
            {
              value: ProposalStatuses.Approved,
              label: 'Approved',
              name: ProposalStatuses.Approved,
              classes: {
                inputWrapperChecked:
                  styles.categoriesListApprovedInputWrapperChecked,
              },
            },
            {
              value: ProposalStatuses.Failed,
              label: 'Failed',
              name: ProposalStatuses.Failed,
              classes: {
                inputWrapperChecked:
                  styles.categoriesListFailedInputWrapperChecked,
              },
            },
          ]}
          className={styles.statusFilterRoot}
        />
      </div>
      <div className={styles.proposalList}>
        <div className={styles.categoriesListWrapper}>
          <CategoriesList
            query={router.query as ProposalsQueries}
            queryName="category"
          />
        </div>

        <InfiniteScroll
          dataLength={data.length}
          next={getMoreData}
          hasMore={hasMore}
          loader={<h4 className={styles.loading}>Loading...</h4>}
          style={{ overflow: 'initial' }}
          endMessage={
            <div className={styles.loading}>
              <NoResultsView title="No more results" />
            </div>
          }
        >
          {data.map(item => {
            return (
              <div key={item.id} className={styles.proposalCardWrapper}>
                <ViewProposal dao={dao} proposal={item} showFlag={false} />
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default DAOHome;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { status, category, dao: daoId } = query;

  const dao = await SputnikHttpService.getDaoById(daoId as string);

  if (!dao) {
    return {
      notFound: true,
    };
  }

  const [tokens, proposalsData] = await Promise.all([
    SputnikHttpService.getAccountTokens(daoId as string),
    SputnikHttpService.getProposalsList({
      offset: 0,
      limit: LIST_LIMIT_DEFAULT,
      daoViewFilter: dao.name,
      category: category as FeedCategories,
      status: status as ProposalStatuses,
    }),
  ]);

  return {
    props: {
      dao,
      proposals: proposalsData.data,
      proposalsTotal: proposalsData.total,
      tokens,
    },
  };
};
