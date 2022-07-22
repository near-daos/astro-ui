import React, { FC, useRef, useState } from 'react';
import cn from 'classnames';

import { ProposalFeedItem } from 'types/proposal';
import { Icon } from 'components/Icon';
import { VoteAction } from 'features/proposal/components/VoteTimeline/VoteAction';
import { FinishProposal } from 'features/proposal/components/VoteTimeline/FinishProposal';
import { ExtraActions } from 'features/proposal/components/VoteTimeline/ExtraActions';
import { formatTimestampAsDate } from 'utils/format';
import { useTimelineData } from 'features/proposal/components/VoteTimeline/hooks';
import { useWindowResize } from 'hooks/useWindowResize';
import {
  POINT,
  TOTAL,
} from 'features/proposal/components/VoteTimeline/constants';

import styles from './VoteTimeline.module.scss';

interface VoteTimelineProps {
  className?: string;
  proposal: ProposalFeedItem;
}

export const VoteTimeline: FC<VoteTimelineProps> = ({
  className,
  proposal,
}) => {
  const [total, setTotal] = useState(TOTAL);
  const timeLineRef = useRef<HTMLDivElement>(null);

  useWindowResize(() => {
    if (timeLineRef.current) {
      const totalValue = Math.floor(
        (timeLineRef.current?.clientWidth - 2 * POINT) / POINT
      );

      setTotal(totalValue < 0 ? 0 : totalValue);
    }
  });

  const { extraActions, lastVote, voteActions } = useTimelineData(
    proposal,
    total
  );

  return (
    <div ref={timeLineRef} className={cn(styles.voteTimeline, className)}>
      <div className={styles.createProposal}>
        <div className={styles.successPoint}>
          <Icon name="statusSuccess" className={styles.statusSuccess} />
        </div>
        <div className={styles.text}>Creating proposal</div>
      </div>
      <div className={styles.line} style={{ width: `${total * POINT}px` }}>
        <div
          className={cn(styles.fulfilLine, {
            [styles.failed]:
              proposal.status === 'Rejected' ||
              proposal.voteStatus === 'Expired',
          })}
          style={{
            width:
              proposal.voteStatus === 'Expired' ? '100%' : `${lastVote.left}px`,
          }}
        />
        <ExtraActions actions={extraActions} />
        {voteActions
          .filter(voteAction => voteAction.action)
          .map(voteAction => (
            <VoteAction
              key={`${voteAction.action?.id}_${voteAction.action?.accountId}`}
              type={voteAction.action?.action || 'VoteApprove'}
              position={`${voteAction.left}px`}
              date={
                voteAction?.action?.timestamp
                  ? formatTimestampAsDate(voteAction.action.timestamp)
                  : ''
              }
              name={voteAction?.action?.accountId || ''}
              hash={voteAction?.action?.transactionHash}
            />
          ))}
      </div>

      <FinishProposal
        status={proposal.voteStatus !== 'Expired' ? proposal.status : 'Expired'}
      />
    </div>
  );
};
