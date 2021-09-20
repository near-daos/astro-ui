import { ProposalCardProps } from 'components/cards/proposal-card';
import { useSelectedDAO } from 'hooks/useSelectedDao';
import { NextPage } from 'next';
import React, { useState, useCallback, CSSProperties } from 'react';

import axios from 'axios';
import cn from 'classnames';
import get from 'lodash/get';
import { useMedia, useMount } from 'react-use';

import {
  DaoDetails,
  DaoDetailsProps
} from 'features/dao-home/components/dao-details/DaoDetails';
import { CreateProposalPopup } from 'features/dao-home/components/create-proposal-popup/CreateProposalPopup';
import { ProposalCardRenderer } from 'components/cards/proposal-card/ProposalCardRenderer';

import { Icon } from 'components/Icon';
import { useModal } from 'components/modal';
import { Dropdown } from 'components/dropdown/Dropdown';
import { IconButton } from 'components/button/IconButton';
import ScrollList from 'components/scroll-list/ScrollList';
import { Collapsable } from 'components/collapsable/Collapsable';
import {
  DaoInfoCard,
  DaoInfoCardProps
} from 'components/cards/dao-info-card/DaoInfoCard';
import {
  ProposalTrackerCard,
  ProposalTrackerProps
} from 'components/cards/proposal-tracker-card/ProposalTrackerCard';

import { ProposalType } from 'types/proposal';

import {
  getProposalStats,
  getDaoDetailsFromDao,
  getFundAndMembersNum,
  useFilteredData
} from 'features/dao-home/helpers';

import styles from './dao-home-page.module.scss';

interface VoteByPeriodInterface {
  title: string;
  key: string;
  subHours: number;
}

interface DaoHomeProps {
  daoDetails: DaoDetailsProps;
  daoInfo: DaoInfoCardProps;
  proposalTrackerInfo: ProposalTrackerProps;
  proposals: ProposalCardProps[];
}

const voteByPeriod: VoteByPeriodInterface[] = [
  {
    title: 'less then 1 hour',
    key: 'lessThanHourProposals',
    subHours: 1
  },
  {
    title: 'less than a day',
    key: 'lessThanDayProposals',
    subHours: 24
  },
  {
    title: 'less than a week',
    key: 'lessThanWeekProposals',
    subHours: 120
  },
  {
    title: 'more than a week',
    key: 'otherProposals',
    subHours: 121
  }
];

const DAOHome: NextPage<DaoHomeProps> = () => {
  const selectedDao = useSelectedDAO();
  const { filter, onFilterChange, filteredData, data } = useFilteredData();

  const [nearPrice, setNearPrice] = useState(0);

  const [showCreateProposalModal] = useModal(CreateProposalPopup);

  const handleClick = useCallback(() => showCreateProposalModal(), [
    showCreateProposalModal
  ]);

  const isMobile = useMedia('(max-width: 767px)');

  useMount(async () => {
    const nearPriceData = await axios.get('/api/nearPrice');
    const price = get(nearPriceData, 'data.near.usd');

    setNearPrice(price);
  });

  function renderProposalsByVotePeriod(period: VoteByPeriodInterface) {
    const { title, key } = period;
    const proposals = filteredData[key];

    const getItemHeight = (index: number) => {
      const item = proposals[index];
      let itemHeight;

      if (isMobile) {
        itemHeight = item.kind.type === ProposalType.Transfer ? 338 : 244;
      } else {
        itemHeight = item.kind.type === ProposalType.Transfer ? 198 : 152;
      }

      return itemHeight;
    };

    function renderCard(cardData: { index: number; style: CSSProperties }) {
      const { index, style } = cardData;

      return (
        <div
          style={{
            ...style,
            marginTop: '0',
            marginBottom: '16px'
          }}
        >
          <ProposalCardRenderer proposal={proposals[index]} />
        </div>
      );
    }

    return (
      <Collapsable
        key={key + proposals.length}
        initialOpenState={proposals.length > 0}
        renderHeading={(toggle, isOpen) => (
          <div
            tabIndex={-1}
            role="button"
            onClick={() => toggle()}
            onKeyDown={e => e.key === 'Spacebar' && toggle()}
            className={styles.votingEnds}
          >
            Voting ends in&nbsp;
            <span className={styles.bold}>{title}</span>
            <IconButton
              icon="buttonArrowRight"
              size="medium"
              className={cn(styles.icon, { [styles.rotate]: isOpen })}
            />
          </div>
        )}
      >
        <ScrollList
          renderItem={renderCard}
          itemCount={proposals.length}
          height={500}
          itemSize={getItemHeight}
        />
      </Collapsable>
    );
  }

  function renderDaoDetails() {
    if (!selectedDao) {
      return null;
    }

    const daoDetails = getDaoDetailsFromDao(selectedDao);
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

    return (
      <div className={styles.proposals}>
        <ProposalTrackerCard
          activeVotes={activeVotes}
          totalProposals={totalProposals}
          onClick={handleClick}
          action={
            <>
              <Icon name="buttonAdd" width={24} /> Create proposal
            </>
          }
        />
      </div>
    );
  }

  function renderDaoMembersFundInfo() {
    if (!selectedDao) {
      return null;
    }

    const { members, fund } = getFundAndMembersNum(selectedDao, nearPrice);

    const info = [
      {
        label: 'Members',
        value: `${members}`
      },
      {
        label: 'DAO funds',
        value: `${fund} USD`
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
            { label: 'Active proposals', value: 'Active proposals' },
            { label: 'Recent proposals', value: 'Recent proposals' },
            { label: 'My proposals', value: 'My proposals' }
          ]}
        />
        {voteByPeriod.map(period => (
          <div key={period.subHours}>{renderProposalsByVotePeriod(period)}</div>
        ))}
      </div>
    </div>
  );
};

export default DAOHome;
