import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import { useMeasure } from 'react-use';

import { Tooltip } from 'astro_2.0/components/Tooltip';
import { Icon } from 'components/Icon';

import { getVotingGoal } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/helpers';

import styles from './GoalChart.module.scss';

interface Props {
  threshold: number;
  totalDelegated: number;
  quorum: number;
}

const ITEM_WIDTH = 110;

export const GoalChart: FC<Props> = ({ threshold, totalDelegated, quorum }) => {
  const [contentWrapperRef, { width }] = useMeasure();

  const votingGoal = getVotingGoal(threshold, totalDelegated, quorum);
  const isError = totalDelegated < votingGoal;

  const data = useMemo(() => {
    const sortedData = [
      {
        label: 'Threshold',
        info: 'some info on tooltip',
        value: threshold,
      },
      {
        label: 'Total Delegated',
        info: 'some info on tooltip',
        value: totalDelegated,
      },
      {
        label: 'Quorum',
        info: 'some info on tooltip',
        value: quorum,
      },
    ].sort((a, b) => {
      if (a.value < b.value) {
        return -1;
      }

      if (a.value > b.value) {
        return 1;
      }

      return 0;
    });

    const max: number = sortedData[2].value || 1;
    const maxPos = width - ITEM_WIDTH;
    let minPos = ITEM_WIDTH;

    const preparedData = sortedData.map((item, i) => {
      const itemPercentagePosition = (item.value * 100) / max;
      let itemPixelPosition = (itemPercentagePosition * width) / 100;

      if (i === 0) {
        if (itemPixelPosition + ITEM_WIDTH > maxPos) {
          itemPixelPosition = maxPos - ITEM_WIDTH;
        }

        minPos = itemPixelPosition;

        if (itemPixelPosition - ITEM_WIDTH < 0) {
          minPos += ITEM_WIDTH;
        }
      } else if (i === 1) {
        if (itemPixelPosition < minPos) {
          itemPixelPosition = minPos;

          minPos += ITEM_WIDTH;
        } else if (itemPixelPosition > maxPos) {
          itemPixelPosition = maxPos;
        }
      } else if (i === sortedData.length - 1) {
        itemPixelPosition = width;
      }

      let isLeftOriented;

      if (i === 0) {
        isLeftOriented = itemPixelPosition - ITEM_WIDTH >= 0;
      } else if (i === 1) {
        isLeftOriented = itemPixelPosition + ITEM_WIDTH > maxPos;
        // itemPixelPosition - ITEM_WIDTH >= minPos;
      } else {
        isLeftOriented = true;
      }

      return {
        ...item,
        isLeftOriented,
        itemPixelPosition,
        itemPercentagePosition,
        showGoal: false,
      };
    });

    let goalSet = false;

    return preparedData.map(item => {
      if (item.value === votingGoal && !goalSet) {
        goalSet = true;

        return {
          ...item,
          showGoal: true,
        };
      }

      return item;
    });
  }, [quorum, threshold, totalDelegated, votingGoal, width]);

  return (
    <div className={styles.root}>
      <div
        className={cn(styles.content, {
          [styles.error]: isError,
        })}
        ref={contentWrapperRef as React.LegacyRef<HTMLDivElement>}
      >
        <div className={styles.bar} />
        {data.map((item, i) => {
          return (
            <div
              id={`goal-item-${i}`}
              className={cn(styles.itemWrapper, {
                [styles.leftOriented]: item.isLeftOriented,
              })}
              style={{
                transform: `translateX(${item.itemPixelPosition}px)`,
              }}
            >
              <div className={styles.label}>
                <span>{item.label}</span>
                <Tooltip
                  placement="top"
                  overlay={<span className={styles.tooltip}>{item.info}</span>}
                >
                  <Icon name="info" width={12} className={styles.infoIcon} />
                </Tooltip>
              </div>
              <div
                className={cn(styles.line, {
                  [styles.showGoal]: item.showGoal,
                })}
              />
              {item.showGoal && (
                <div className={styles.votingGoal}>
                  <Icon name="goal" width={18} />
                  {votingGoal}
                </div>
              )}
              <div
                className={cn(styles.valueBadge, {
                  [styles.errorReason]:
                    isError && item.label === 'Total Delegated',
                })}
              >
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
