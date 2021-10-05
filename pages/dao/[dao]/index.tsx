import React, { useRef, useEffect, useCallback } from 'react';
import isEmpty from 'lodash/isEmpty';

import { nearConfig } from 'config/index';

import {
  DaoInfoCard,
  DaoInfoCardProps
} from 'components/cards/dao-info-card/DaoInfoCard';
import { ProposalCardProps } from 'components/cards/proposal-card';
import {
  ProposalTrackerCard,
  ProposalTrackerProps
} from 'components/cards/proposal-tracker-card/ProposalTrackerCard';
import { Dropdown } from 'components/dropdown/Dropdown';
import { Icon } from 'components/Icon';
import { useModal } from 'components/modal';
import { CreateProposalPopup } from 'features/dao-home/components/create-proposal-popup/CreateProposalPopup';
import { ProposalCollapsableSection } from 'features/dao-home/components/proposals-collapsable-section';
import {
  DaoDetails,
  DaoDetailsProps
} from 'features/dao-home/components/dao-details/DaoDetails';

import {
  getDaoDetailsFromDao,
  getFundAndMembersNum,
  getProposalStats,
  useFilteredData
} from 'features/dao-home/helpers';
import { useDao } from 'hooks/useDao';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { SputnikService } from 'services/SputnikService';
import { VOTE_BY_PERIOD } from 'constants/votingConstants';
import { ProposalStatus } from 'types/proposal';

import { useAuthContext } from 'context/AuthContext';
import { useNearPrice } from 'hooks/useNearPrice';

import styles from './dao-home-page.module.scss';

interface DaoHomeProps {
  daoDetails: DaoDetailsProps;
  daoInfo: DaoInfoCardProps;
  proposalTrackerInfo: ProposalTrackerProps;
  proposals: ProposalCardProps[];
}

const DAOHome: NextPage<DaoHomeProps> = () => {
  const timeoutId = useRef<NodeJS.Timeout>();
  const { accountId } = useAuthContext();

  const router = useRouter();
  const {
    pending: isPending,
    proposal: proposalId,
    proposalStatus,
    dao: daoId
  } = router.query;
  const dao = useDao(daoId as string);

  const { filter, onFilterChange, filteredData, data } = useFilteredData(
    proposalStatus ? (proposalStatus as ProposalStatus) : undefined
  );

  const nearPrice = useNearPrice();

  const [showCreateProposalModal] = useModal(CreateProposalPopup);

  const handleClick = useCallback(() => showCreateProposalModal(), [
    showCreateProposalModal
  ]);

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
    const { activeVotes, totalProposals } = getProposalStats(data);

    const action =
      isPending || isEmpty(accountId) ? null : (
        <>
          <Icon name="buttonAdd" width={24} /> Create proposal
        </>
      );

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
        label: 'Members',
        value: `${members}`,
        link: `/dao/${dao.id}/treasury/tokens`
      },
      {
        label: 'DAO funds',
        value: `${fund} USD`,
        link: `/dao/${dao.id}/treasury/tokens`
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
        <Dropdown
          className={styles.onTop}
          defaultValue="Active proposals"
          onChange={onFilterChange}
          value={filter}
          options={[
            {
              label: 'Active proposals',
              value: 'Active proposals'
            },
            {
              label: 'Recent proposals',
              value: 'Recent proposals'
            },
            {
              label: 'My proposals',
              value: 'My proposals'
            }
          ]}
        />
        {VOTE_BY_PERIOD.map(period => (
          <ProposalCollapsableSection
            filter={filter}
            key={period.key}
            proposals={filteredData[period.key]}
            title={period.title}
            view={period.key}
            expandedProposalId={(proposalId ?? '') as string}
          />
        ))}
      </div>
    </div>
  );
};

export default DAOHome;
