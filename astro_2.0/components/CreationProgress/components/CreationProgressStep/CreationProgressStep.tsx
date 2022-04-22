import cn from 'classnames';
import { useCallback, VFC } from 'react';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import styles from './CreationProgressStep.module.scss';

interface CreationStepProps {
  label: string;
  value?: string;
  className?: string;
  isCurrent?: boolean;
  isComplete?: boolean;
  onItemClick?: (value: string) => void;
}

export const CreationProgressStep: VFC<CreationStepProps> = props => {
  const { label, value, isCurrent, isComplete, className, onItemClick } = props;

  const isClickable = onItemClick && isComplete;

  const rootClassName = cn(className, styles.step, {
    [styles.complete]: isComplete,
    [styles.current]: isCurrent,
    [styles.clickable]: isClickable,
  });

  const onStepClick = useCallback(() => {
    if (onItemClick && value && isClickable) {
      onItemClick(value);
    }
  }, [value, isClickable, onItemClick]);

  return (
    <Button
      size="small"
      variant="transparent"
      onClick={onStepClick}
      className={rootClassName}
      key={`${label}_${isComplete}`}
    >
      <div className={styles.stepCircle}>
        <Icon name="buttonCheck" className={styles.checkIcon} />
      </div>
      <div className={styles.stepLabel} data-label={label} />
    </Button>
  );
};
