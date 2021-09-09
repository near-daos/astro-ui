import {
  DaoDetails,
  DaoDetailsProps
} from 'features/dao-home/components/dao-details/DaoDetails';
import React, { CSSProperties, useCallback } from 'react';
import { DAO_DETAILS, DAO_INFO, DAO_PROPOSALS } from 'lib/mocks/dao-home';
import {
  DaoInfoCard,
  DaoInfoCardProps
} from 'components/cards/dao-info-card/DaoInfoCard';
import {
  ProposalTrackerCard,
  ProposalTrackerProps
} from 'components/cards/proposal-tracker-card/ProposalTrackerCard';
import { Dropdown } from 'components/dropdown/Dropdown';
import {
  ProposalCard,
  ProposalCardProps
} from 'components/cards/proposal-card';
import ScrollList from 'components/scroll-list/ScrollList';
import { useModal } from 'components/modal';
import { CreateProposalPopup } from 'features/dao-home/components/create-proposal-popup/CreateProposalPopup';
import { Collapsable } from 'components/collapsable/Collapsable';
import { IconButton } from 'components/button/IconButton';
import classNames from 'classnames';
import { Icon } from 'components/Icon';
import { ProposalType } from 'types/proposal';

import styles from 'pages/dao/[id]/dao-home-page.module.scss';

interface DaoHomeProps {
  daoDetails: DaoDetailsProps;
  daoInfo: DaoInfoCardProps;
  proposalTrackerInfo: ProposalTrackerProps;
  proposals: ProposalCardProps[];
}

const voteByPeriod = [
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

const DaoHome: React.FC<DaoHomeProps> = ({
  daoDetails = DAO_DETAILS,
  daoInfo = DAO_INFO,
  proposalTrackerInfo = { activeVotes: 8, totalProposals: 9 },
  proposals = DAO_PROPOSALS
}) => {
  const flag = (daoDetails.flag as StaticImageData).src;
  const [showCreateProposalModal] = useModal(CreateProposalPopup);

  const handleClick = useCallback(() => showCreateProposalModal(), [
    showCreateProposalModal
  ]);

  const getItemHeight = (index: number) => {
    const item = proposals[index];

    return item.type === ProposalType.Transfer ? 198 : 152;
  };

  const renderCard = ({
    index,
    style
  }: {
    index: number;
    style: CSSProperties;
  }) => (
    <div
      style={{
        ...style,
        marginTop: '8px',
        marginBottom: '8px'
      }}
    >
      <ProposalCard {...proposals[index]} />
    </div>
  );

  const renderProposalsByVotePeriod = ({
    title,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subHours
  }: {
    title: string;
    subHours: number;
  }) => (
    // todo filter proposals by subhours
    <Collapsable
      key={title}
      isOpen
      renderHeading={(toggleHeading, isHeadingOpen) => (
        <div className={styles.votingEnds}>
          Voting ends in less &nbsp;
          <div className={styles.bold}>{title}</div>
          <IconButton
            icon="buttonArrowRight"
            size="medium"
            onClick={() => toggleHeading()}
            className={classNames(styles.icon, {
              [styles.rotate]: isHeadingOpen
            })}
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

  return (
    <div className={styles.root}>
      <div className={styles.daoDetails}>
        <DaoDetails {...daoDetails} flag={flag} />
      </div>
      <div className={styles.proposals}>
        <ProposalTrackerCard
          {...proposalTrackerInfo}
          onClick={handleClick}
          action={
            <>
              <Icon name="buttonAdd" width={24} /> Create proposal
            </>
          }
        />
      </div>
      <div className={styles.daoInfo}>
        <DaoInfoCard {...daoInfo} />
      </div>
      <div className={styles.filter}>
        <Dropdown
          className={styles.onTop}
          defaultValue="Active proposals"
          options={[
            { label: 'Active proposals', value: 'Active proposals' },
            { label: 'Recent proposals', value: 'Recent proposals' },
            { label: 'My proposals', value: 'My proposals' }
          ]}
        />
      </div>
      <div className={styles.proposalList}>
        {voteByPeriod.map(period => renderProposalsByVotePeriod(period))}
      </div>
    </div>
  );
};

export default DaoHome;
