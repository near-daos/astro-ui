import React, { useRef, useEffect, useCallback, useState } from 'react';
import isEmpty from 'lodash/isEmpty';

import { nearConfig } from 'config/index';

import { DaoInfoCard } from 'components/cards/dao-info-card/DaoInfoCard';
import { ProposalTrackerCard } from 'components/cards/proposal-tracker-card/ProposalTrackerCard';
import { useModal } from 'components/modal';
import { CreateProposalPopup } from 'features/dao-home/components/create-proposal-popup/CreateProposalPopup';
import { ProposalCollapsableSection } from 'features/dao-home/components/proposals-collapsable-section';
import { DaoDetails } from 'features/dao-home/components/dao-details/DaoDetails';
import { ProposalsTabsFilter } from 'components/proposals-tabs-filter';

import {
  filterProposalsByStatus,
  getDaoDetailsFromDao,
  getFundAndMembersNum,
  getProposalStats
} from 'features/dao-home/helpers';
import { splitProposalsByVotingPeriod } from 'helpers/splitProposalsByVotingPeriod';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { SputnikService } from 'services/SputnikService';
import { VOTE_BY_PERIOD } from 'constants/votingConstants';
import { Proposal } from 'types/proposal';

import { useAuthContext } from 'context/AuthContext';
import { useNearPrice } from 'hooks/useNearPrice';

import { DAO } from 'types/dao';

import styles from './dao-home-page.module.scss';

interface DaoHomeProps {
  dao: DAO;
  proposals: Proposal[];
}

const DAOHome: NextPage<DaoHomeProps> = ({
  dao: initialDao,
  proposals: initialProposals
}) => {
  const timeoutId = useRef<NodeJS.Timeout>();
  const { accountId } = useAuthContext();

  const router = useRouter();
  const { pending: isPending, proposal: proposalId, dao: daoId } = router.query;

  const [dao] = useState(initialDao);
  const [proposals] = useState(initialProposals);

  const nearPrice = useNearPrice();

  const [showCreateProposalModal] = useModal(CreateProposalPopup);

  const handleClick = useCallback(async () => {
    await showCreateProposalModal();
  }, [showCreateProposalModal]);

  const getPendingDaoId = useCallback(() => {
    return `${daoId}.${nearConfig.contractName}`;
  }, [daoId]);

  const fetchPendingDaoInfo = useCallback(async () => {
    const id = getPendingDaoId();
    const daoInfo = await SputnikService.getDaoById(id);

    if (!daoInfo) {
      timeoutId.current = setTimeout(fetchPendingDaoInfo, 2000);
    } else {
      router.push(`/dao/${id}`);
    }
  }, [router, getPendingDaoId]);

  useEffect(() => {
    if (isPending) {
      fetchPendingDaoInfo();
    }

    return () => {
      const timeout = timeoutId.current;

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [daoId, isPending, fetchPendingDaoInfo]);

  function renderDaoDetails() {
    if (!dao && !isPending) {
      return null;
    }

    const daoDetails = dao
      ? getDaoDetailsFromDao(dao)
      : {
          title: daoId as string,
          subtitle: getPendingDaoId(),
          description: 'Dao is being created. Please, be patient.',
          flag: '',
          createdAt: '',
          links: []
        };

    const { title, description, flag, subtitle, createdAt, links } = daoDetails;

    return (
      <div className={styles.daoDetails}>
        <DaoDetails
          title={title}
          description={description}
          flag={flag}
          subtitle={subtitle}
          createdAt={createdAt}
          links={links}
        />
      </div>
    );
  }

  function renderProposalTracker() {
    const { activeVotes, totalProposals } = getProposalStats(proposals);

    const action =
      isPending || isEmpty(accountId) ? null : <>Create proposal</>;

    return (
      <div className={styles.proposals}>
        <ProposalTrackerCard
          activeVotes={activeVotes}
          totalProposals={totalProposals}
          onClick={handleClick}
          action={action}
        />
      </div>
    );
  }

  function renderDaoMembersFundInfo() {
    if (!dao) {
      return null;
    }

    const { members, fund } = getFundAndMembersNum(dao, nearPrice);

    const info = [
      {
        label: 'DAO funds',
        value: `${fund}`,
        valueType: `USD`,
        link: accountId ? `/dao/${dao.id}/treasury/tokens` : null
      },
      {
        label: 'Members',
        value: `${members}`,
        link: accountId ? `/dao/${dao.id}/groups/all-members` : null
      }
    ];

    return (
      <div className={styles.daoInfo}>
        <DaoInfoCard items={info} />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {renderDaoDetails()}
      {renderProposalTracker()}
      {renderDaoMembersFundInfo()}
      <div className={styles.proposalList}>
        <ProposalsTabsFilter
          proposals={proposals}
          filter={filterProposalsByStatus}
          tabsConfig={[
            {
              label: 'Active proposals',
              className: styles.activeProposalsTab
            },
            {
              label: 'Approved',
              className: styles.approvedProposalsTab
            },
            {
              label: 'Failed',
              className: styles.failedProposalsTab
            }
          ]}
          tabContentRenderer={(tabProposals: Proposal[]) => {
            const filteredData = splitProposalsByVotingPeriod(tabProposals);

            return (
              <>
                {VOTE_BY_PERIOD.map(period => (
                  <ProposalCollapsableSection
                    key={period.key}
                    proposals={filteredData[period.key]}
                    title={period.title}
                    view={period.key}
                    expandedProposalId={(proposalId ?? '') as string}
                  />
                ))}
              </>
            );
          }}
        />
      </div>
    </div>
  );
};

export default DAOHome;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const isPending = Boolean(query.pending);
  const daoId = query.dao as string;

  const dao = await SputnikService.getDaoById(daoId as string);

  if (!dao && !isPending) {
    return {
      notFound: true
    };
  }

  const proposals = await SputnikService.getProposals(daoId as string);

  return {
    props: {
      dao,
      proposals
    }
  };
};
