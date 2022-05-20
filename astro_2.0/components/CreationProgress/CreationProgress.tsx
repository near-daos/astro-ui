import cn from 'classnames';
import { useMedia } from 'react-use';
import { useEffect, VFC } from 'react';

import { CreationProgressStep } from './components/CreationProgressStep';

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

const CURRENT_EL_CLASSNAME = 'a-cp-current';

export const CreationProgress: VFC<CreationProgressProps> = ({
  steps,
  className,
  onItemClick,
}) => {
  const isMobile = useMedia('(max-width: 768px)');

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    const currentItems = document.getElementsByClassName(CURRENT_EL_CLASSNAME);

    if (currentItems && currentItems[0]) {
      currentItems[0].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'start',
      });
    }
  }, [steps, isMobile]);

  return (
    <div className={cn(className, styles.root)}>
      {steps.map((step, index) => {
        const { label, value, isCurrent, isComplete } = step;

        const complete = !!(
          isComplete || steps.find((item, i) => index <= i && item.isComplete)
        );

        return (
          <CreationProgressStep
            key={value}
            label={label}
            value={value}
            isCurrent={isCurrent}
            isComplete={complete}
            onItemClick={onItemClick}
            className={cn({ [CURRENT_EL_CLASSNAME]: isCurrent })}
          />
        );
      })}
    </div>
  );
};
