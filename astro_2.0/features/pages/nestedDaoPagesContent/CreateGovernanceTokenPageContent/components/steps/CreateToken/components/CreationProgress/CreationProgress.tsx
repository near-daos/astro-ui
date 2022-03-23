import { VFC } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import styles from './CreationProgress.module.scss';

interface Step {
  label: string;
  value?: string;
  isCurrent?: boolean;
  isComplete?: boolean;
}

interface CreationProgressProps {
  steps: Step[];
  className?: string;
  onItemClick?: (value: string) => void;
}

export const CreationProgress: VFC<CreationProgressProps> = ({
  steps,
  className,
  onItemClick,
}) => {
  return (
    <div className={cn(className, styles.root)}>
      {steps.map((step, index) => {
        const { label, isCurrent, isComplete } = step;

        const isClickable =
          isComplete ||
          steps.find(
            (item, i) =>
              (index <= i && item.isComplete) ||
              (i === index - 1 && item.isComplete)
          );

        const stepClassName = cn(styles.step, {
          [styles.complete]: isComplete,
          [styles.current]: isCurrent,
          [styles.clickable]: isClickable,
        });

        return (
          <Button
            variant="transparent"
            className={stepClassName}
            key={`${label}_${isComplete}`}
            onClick={() => {
              if (onItemClick && step.value && isClickable) {
                onItemClick(step.value);
              }
            }}
          >
            <div className={styles.stepCircle}>
              <Icon name="buttonCheck" className={styles.checkIcon} />
            </div>
            {label}
          </Button>
        );
      })}
    </div>
  );
};
