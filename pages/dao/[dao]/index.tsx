import React, { useCallback, useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';

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
  const router = useRouter();
  const { proposal: proposalId } = router.query;

  const { accountId } = useAuthContext();
  const nearPrice = useNearPrice();

  const [dao] = useState(initialDao);
  const [proposals, setProposals] = useState(initialProposals);

  const [showCreateProposalModal] = useModal(CreateProposalPopup);

  const handleClick = useCallback(async () => {
    await showCreateProposalModal();
    // TODO: refactor
    SputnikService.getProposals(dao.id).then(setProposals);
  }, [showCreateProposalModal, dao.id]);

  useEffect(() => {
    // TODO: refactor
    SputnikService.getProposals(dao.id).then(setProposals);
  }, [dao.id]);

  function renderDaoDetails() {
    const daoDetails = getDaoDetailsFromDao(dao);
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

    const action = isEmpty(accountId) ? null : <>Create proposal</>;

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
  const daoId = query.dao as string;

  const dao = await SputnikService.getDaoById(daoId as string);

  if (!dao) {
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
