import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import { useMeasure, useMedia } from 'react-use';

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
const ITEM_HEIGHT = 50;

export const GoalChart: FC<Props> = ({ threshold, totalDelegated, quorum }) => {
  const [contentWrapperRef, { width, height }] = useMeasure();
  const isMobile = useMedia('(max-width: 768px)');

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
    const maxPos = isMobile ? height - ITEM_HEIGHT : width - ITEM_WIDTH;
    let minPos = isMobile ? ITEM_HEIGHT : ITEM_WIDTH;
    const size = isMobile ? height : width;
    const ITEM_SIZE = isMobile ? ITEM_HEIGHT : ITEM_WIDTH;

    const preparedData = sortedData.map((item, i) => {
      const itemPercentagePosition = (item.value * 100) / max;
      let itemPixelPosition = (itemPercentagePosition * size) / 100;

      if (i === 0) {
        if (itemPixelPosition + ITEM_SIZE > maxPos) {
          itemPixelPosition = maxPos - ITEM_SIZE;
        }

        minPos = itemPixelPosition;

        if (itemPixelPosition - ITEM_SIZE < 0) {
          minPos += ITEM_SIZE;
        }
      } else if (i === 1) {
        if (itemPixelPosition < minPos) {
          itemPixelPosition = minPos;

          minPos += ITEM_SIZE;
        } else if (itemPixelPosition > maxPos) {
          itemPixelPosition = maxPos;
        }
      } else if (i === sortedData.length - 1) {
        itemPixelPosition = size;
      }

      let isLeftOriented;

      if (i === 0) {
        isLeftOriented = itemPixelPosition - ITEM_SIZE >= 0;
      } else if (i === 1) {
        isLeftOriented = itemPixelPosition + ITEM_SIZE > maxPos;
        // itemPixelPosition - ITEM_SIZE >= minPos;
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
  }, [height, isMobile, quorum, threshold, totalDelegated, votingGoal, width]);

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
                transform: isMobile
                  ? `translateY(${item.itemPixelPosition}px)`
                  : `translateX(${item.itemPixelPosition}px)`,
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
                  <span className={styles.desktop}>{votingGoal}</span>
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
