import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  CSSProperties
} from 'react';
import axios from 'axios';
import cn from 'classnames';
import { useMedia, useMount } from 'react-use';

import { nearConfig } from 'config/index';

import { IconButton } from 'components/button/IconButton';
import {
  DaoInfoCard,
  DaoInfoCardProps
} from 'components/cards/dao-info-card/DaoInfoCard';
import { ProposalCardProps } from 'components/cards/proposal-card';
import { ProposalCardRenderer } from 'components/cards/proposal-card/ProposalCardRenderer';
import {
  ProposalTrackerCard,
  ProposalTrackerProps
} from 'components/cards/proposal-tracker-card/ProposalTrackerCard';
import { Collapsable } from 'components/collapsable/Collapsable';
import { Dropdown } from 'components/dropdown/Dropdown';
import { Icon } from 'components/Icon';
import { useModal } from 'components/modal';
import ScrollList from 'components/scroll-list/ScrollList';
import { CreateProposalPopup } from 'features/dao-home/components/create-proposal-popup/CreateProposalPopup';

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
import get from 'lodash/get';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { ProposalType } from 'types/proposal';
import { SputnikService } from 'services/SputnikService';
import { VOTE_BY_PERIOD } from 'constants/votingConstants';

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

const DAOHome: NextPage<DaoHomeProps> = () => {
  const timeoutId = useRef<NodeJS.Timeout>();

  const router = useRouter();
  const isPending = router.query.pending;

  const daoId = router.query.dao as string;
  const dao = useDao(daoId);

  const { filter, onFilterChange, filteredData, data } = useFilteredData();

  const [nearPrice, setNearPrice] = useState(0);

  const [showCreateProposalModal] = useModal(CreateProposalPopup);

  const handleClick = useCallback(() => showCreateProposalModal(), [
    showCreateProposalModal
  ]);

  const isMobile = useMedia('(max-width: 767px)');

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

  useMount(async () => {
    const nearPriceData = await axios.get('/api/nearPrice');
    const price = get(nearPriceData, 'data.near.usd');

    setNearPrice(price);
  });

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

  function renderProposalsByVotePeriod(period: VoteByPeriodInterface) {
    const { title, key } = period;
    const proposals = filteredData[key];

    const getItemHeight = (index: number) => {
      const item = proposals[index];
      let itemHeight;

      if (isMobile) {
        itemHeight = item.kind.type === ProposalType.Transfer ? 200 : 230;
      } else {
        itemHeight = 190;
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

    if (!proposals.length) {
      return null;
    }

    function getHeader() {
      if (key === 'otherProposals') {
        return (
          <>
            Voting &nbsp;
            <span className={styles.bold}>ended</span>
          </>
        );
      }

      return (
        <>
          Voting ends in &nbsp;
          <span className={styles.bold}>{title}</span>
        </>
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
            {getHeader()}
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

    const action = isPending ? null : (
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
          <div key={period.key}>{renderProposalsByVotePeriod(period)}</div>
        ))}
      </div>
    </div>
  );
};

export default DAOHome;
