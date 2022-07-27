import { useEffect, useState, VFC } from 'react';
import cn from 'classnames';
import { format, millisecondsToSeconds } from 'date-fns';
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
  status: 'success' | 'warn' | 'error';
  lastAstroBlockDetails?: AggregatorBlock;
  lastHandledBlockDetails?: AggregatorBlock;
};

export const AppHealth: VFC = () => {
  const { socket } = useSocket();
  const { appHealth } = useFlags();
  const [state, setState] = useState<State>({ status: 'success' });

  useEffect(() => {
    if (socket && appHealth) {
      socket.on(
        'aggregator-blocks',
        ({ lastAstroBlock, lastHandledBlock }: AggregatorBlocks) => {
          if (!lastAstroBlock.timestamp || !lastHandledBlock.timestamp) {
            return;
          }

          const diff = millisecondsToSeconds(
            (+lastAstroBlock.timestamp - +lastHandledBlock.timestamp) / 1000000
          );

          if (diff > 20 && state.status !== 'error') {
            setState({
              status: 'error',
              lastAstroBlockDetails: lastAstroBlock,
              lastHandledBlockDetails: lastHandledBlock,
            });
          } else if (diff > 10 && diff <= 20 && state.status !== 'warn') {
            setState({
              status: 'warn',
              lastAstroBlockDetails: lastAstroBlock,
              lastHandledBlockDetails: lastHandledBlock,
            });
          } else if (diff <= 10 && state.status !== 'success') {
            setState({
              status: 'success',
              lastAstroBlockDetails: lastAstroBlock,
              lastHandledBlockDetails: lastHandledBlock,
            });
          }
        }
      );
    }
  }, [appHealth, socket, state.status]);

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
          <h3 className={styles.tooltipStatus}>
            Application Health: <b>{state.status}</b>
          </h3>
          {renderTooltipRow(
            'Last handled block',
            state.lastHandledBlockDetails
          )}
          {renderTooltipRow('Last Astro block', state.lastAstroBlockDetails)}
        </div>
      }
    >
      <div
        className={cn(styles.indicator, {
          [styles.success]: state.status === 'success',
          [styles.error]: state.status === 'error',
          [styles.warn]: state.status === 'warn',
        })}
      />
    </Tooltip>
  );
};
