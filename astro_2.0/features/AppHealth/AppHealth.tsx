import { useEffect, useState, VFC } from 'react';
import cn from 'classnames';
import { useMountedState } from 'react-use';
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

type Status = 'success' | 'warn' | 'error' | null;

type State = {
  status: Status;
  lastAstroBlockDetails?: AggregatorBlock;
  lastHandledBlockDetails?: AggregatorBlock;
};

export const AppHealth: VFC = () => {
  const { socket } = useSocket();
  const { appHealth } = useFlags();
  const isMounted = useMountedState();
  const [state, setState] = useState<State>({ status: null });

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

          let status: Status = null;

          if (diff > 20) {
            status = 'error';
          } else if (diff > 10 && diff <= 20) {
            status = 'warn';
          } else if (diff <= 10) {
            status = 'success';
          }

          if (isMounted()) {
            setState({
              status,
              lastAstroBlockDetails: lastAstroBlock,
              lastHandledBlockDetails: lastHandledBlock,
            });
          }
        }
      );
    }
  }, [appHealth, isMounted, socket, state.status]);

  function renderTooltipRow(title: string, data?: AggregatorBlock) {
    return (
      <div className={styles.tooltipRow}>
        <h3>{title}:</h3>
        <div>
          <b>Height:</b> {data?.height ?? 'n/a'}
        </div>
        <div className={styles.value}>
          <b>Date:</b>{' '}
          {data?.timestamp
            ? format(new Date(+data.timestamp / 1000000), DATE_TIME_FORMAT)
            : 'n/a'}
        </div>
      </div>
    );
  }

  function renderTooltipOverlay(color: string, percent: number) {
    return (
      <div
        className={styles.overlay}
        // style={{ boxShadow: `0 0 8px 0 ${color}` }}
      >
        <div
          className={styles.handledMin}
          style={{
            backgroundColor: color,
          }}
        />
        <div
          className={styles.handled}
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
        />
        <div className={styles.astro} />
      </div>
    );
  }

  function calculateIndicatorParams() {
    const { lastAstroBlockDetails, lastHandledBlockDetails } = state;

    if (
      !lastAstroBlockDetails?.timestamp ||
      !lastHandledBlockDetails?.timestamp
    ) {
      return {
        color: 'transparent',
        percent: 0,
      };
    }

    const astro = +lastAstroBlockDetails.timestamp / 1000000;
    const handled = +lastHandledBlockDetails.timestamp / 1000000;

    let zeroPoint = astro - 60000;

    if (zeroPoint > handled) {
      zeroPoint = handled;
    }

    const astroVal = astro - zeroPoint;
    const handledVal = handled - zeroPoint;
    const percent = (handledVal * 100) / astroVal;

    const from = {
      r: 255,
      g: 94,
      b: 3,
    };

    const to = {
      r: 25,
      g: 217,
      b: 146,
    };

    const red = from.r + (percent / 100) * (to.r - from.r);
    const green = from.g + (percent / 100) * (to.g - from.g);
    const blue = from.b + (percent / 100) * (to.b - from.b);

    return {
      color: `rgb(${red}, ${green}, ${blue})`,
      percent,
    };
  }

  if (!appHealth) {
    return null;
  }

  const { color, percent } = calculateIndicatorParams();

  return (
    <Tooltip
      className={styles.root}
      overlay={
        <div className={styles.tooltipWrapper}>
          <h3 className={styles.tooltipStatus}>
            Application Health: <b>{state.status}</b>
          </h3>
          {renderTooltipOverlay(color, percent)}
          <div className={styles.row}>
            {renderTooltipRow(
              'Last handled block',
              state.lastHandledBlockDetails
            )}
            {renderTooltipRow('Last Astro block', state.lastAstroBlockDetails)}
          </div>
        </div>
      }
    >
      <div
        className={cn(styles.indicator, {
          [styles.success]: state.status === 'success',
          [styles.error]: state.status === 'error',
          [styles.warn]: state.status === 'warn',
        })}
        style={{
          backgroundColor: color,
        }}
      />
    </Tooltip>
  );
};
