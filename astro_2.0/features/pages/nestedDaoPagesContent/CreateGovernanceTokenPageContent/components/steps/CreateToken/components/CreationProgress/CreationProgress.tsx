import { VFC } from 'react';
import cn from 'classnames';
import map from 'lodash/map';

import { Icon } from 'components/Icon';

import styles from './CreationProgress.module.scss';

interface Step {
  label: string;
  isCurrent?: boolean;
  isComplete?: boolean;
}

interface CreationProgressProps {
  steps: Step[];
  className?: string;
}

export const CreationProgress: VFC<CreationProgressProps> = ({
  steps,
  className,
}) => {
  function renderStep(step: Step) {
    const { label, isCurrent, isComplete } = step;

    const stepClassName = cn(styles.step, {
      [styles.current]: isCurrent,
      [styles.complete]: isComplete,
    });

    return (
      <div className={stepClassName}>
        <div className={styles.stepCircle}>
          <Icon name="buttonCheck" className={styles.checkIcon} />
        </div>
        {label}
      </div>
    );
  }

  return (
    <div className={cn(className, styles.root)}>{map(steps, renderStep)}</div>
  );
};
