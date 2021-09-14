import React, {
  FC,
  useState,
  useEffect,
  useCallback,
  CSSProperties
} from 'react';

import axios from 'axios';
import cn from 'classnames';
import get from 'lodash/get';
import { useSelector } from 'react-redux';
import { useMedia, useMount } from 'react-use';

import { DaoDetails } from 'features/dao-home/components/dao-details/DaoDetails';
import { CreateProposalPopup } from 'features/dao-home/components/create-proposal-popup/CreateProposalPopup';
import { ProposalCardRenderer } from 'components/cards/proposal-card/ProposalCardRenderer';

import { Icon } from 'components/Icon';
import { useModal } from 'components/modal';
import { Dropdown } from 'components/dropdown/Dropdown';
import { IconButton } from 'components/button/IconButton';
import ScrollList from 'components/scroll-list/ScrollList';
import { Collapsable } from 'components/collapsable/Collapsable';
import { DaoInfoCard } from 'components/cards/dao-info-card/DaoInfoCard';
import { ProposalTrackerCard } from 'components/cards/proposal-tracker-card/ProposalTrackerCard';

import { Proposal, ProposalType } from 'types/proposal';

import { selectSelectedDAO } from 'store/dao';
import { SputnikService } from 'services/SputnikService';

import {
  getProposalStats,
  getDaoDetailsFromDao,
  getFundAndMembersNum
} from './helpers';

import styles from './dao-home-page.module.scss';

interface VoteByPeriodInterface {
  title: string;
  subHours: number;
}

const voteByPeriod: VoteByPeriodInterface[] = [
  {
    title: 'less then 1 hour',
    subHours: 1
  },
  {
    title: 'less than a day',
    subHours: 24
  },
  {
    title: 'less than a week',
    subHours: 120
  }
];

const DaoHome: FC = () => {
  const selectedDao = useSelector(selectSelectedDAO);

  const [nearPrice, setNearPrice] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const [showCreateProposalModal] = useModal(CreateProposalPopup);

  const handleClick = useCallback(() => showCreateProposalModal(), [
    showCreateProposalModal
  ]);

  const isMobile = useMedia('(max-width: 767px)');

  useEffect(() => {
    async function fetchProposals() {
      if (selectedDao) {
        const daoProposals = await SputnikService.getProposals(selectedDao.id);

        setProposals(daoProposals);
      }
    }

    fetchProposals();
  }, [selectedDao]);

  useMount(async () => {
    const data = await axios.get('/api/nearPrice');
    const price = get(data, 'data.near.usd');

    setNearPrice(price);
  });

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

  function renderProposalsByVotePeriod(period: VoteByPeriodInterface) {
    const { title, subHours } = period;

    return (
      // todo filter proposals by subhours
      <Collapsable
        key={subHours}
        initialOpenState
        renderHeading={(toggle, isOpen) => (
          <div
            tabIndex={-1}
            role="button"
            onClick={() => toggle()}
            onKeyDown={e => e.key === 'Spacebar' && toggle()}
            className={styles.votingEnds}
          >
            Voting ends in less &nbsp;
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
    const { activeVotes, totalProposals } = getProposalStats(proposals);

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

export default DaoHome;
