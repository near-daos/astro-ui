import { useEffect, useState, VFC } from 'react';
import cn from 'classnames';
import { format } from 'date-fns';
import { useSocket } from 'context/SocketContext';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { Tooltip } from 'astro_2.0/components/Tooltip';

import { DATE_TIME_FORMAT } from 'constants/timeConstants';

import styles from './AppHealth.module.scss';

type AggregatorBlock = {
  height: string;
  timestamp: string;
};

type AggregatorBlocks = {
  lastBlock: AggregatorBlock;
  lastAstroBlock: AggregatorBlock;
  lastHandledBlock: AggregatorBlock;
};

type State = {
  isError: boolean;
  lastAstroBlockDetails?: AggregatorBlock;
  lastHandledBlockDetails?: AggregatorBlock;
};

export const AppHealth: VFC = () => {
  const { socket } = useSocket();
  const { appHealth } = useFlags();
  const [status, setStatus] = useState<State>({ isError: false });

  useEffect(() => {
    if (socket && appHealth) {
      socket.on(
        'aggregator-blocks',
        ({ lastAstroBlock, lastHandledBlock }: AggregatorBlocks) => {
          if (
            lastAstroBlock.height !== lastHandledBlock.height &&
            !status.isError
          ) {
            setStatus({
              isError: true,
              lastAstroBlockDetails: lastAstroBlock,
              lastHandledBlockDetails: lastHandledBlock,
            });
          } else if (
            lastAstroBlock.height === lastHandledBlock.height &&
            status.isError
          ) {
            setStatus({
              isError: false,
              lastAstroBlockDetails: lastAstroBlock,
              lastHandledBlockDetails: lastHandledBlock,
            });
          }
        }
      );
    }

    return () => {
      socket?.disconnect();
    };
  }, [appHealth, socket, status]);

  function renderTooltipRow(title: string, data?: AggregatorBlock) {
    return (
      <div className={styles.tooltipRow}>
        <h3>{title}:</h3>
        <div>
          <b>Height:</b> {data?.height ?? 'n/a'}
        </div>
        <div>
          <b>Date:</b>{' '}
          {data?.timestamp
            ? format(new Date(+data.timestamp / 1000000), DATE_TIME_FORMAT)
            : 'n/a'}
        </div>
      </div>
    );
  }

  if (!appHealth) {
    return null;
  }

  return (
    <Tooltip
      className={styles.root}
      overlay={
        <div className={styles.tooltipWrapper}>
          {renderTooltipRow(
            'Last handled block',
            status.lastHandledBlockDetails
          )}
          {renderTooltipRow('Last Astro block', status.lastAstroBlockDetails)}
        </div>
      }
    >
      <div
        className={cn(styles.indicator, {
          [styles.success]: !status.isError,
          [styles.error]: status.isError,
        })}
      />
    </Tooltip>
  );
};
