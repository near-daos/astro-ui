import cn from 'classnames';
import { forwardRef } from 'react';

import { Icon, IconName } from 'components/Icon';

import styles from './TokenOption.module.scss';

interface TokenOptionProps {
  label: string;
  icon: IconName;
  selected: boolean;
  className?: string;
  onClick: () => void;
}

export const TokenOption = forwardRef<HTMLDivElement, TokenOptionProps>(
  (props, ref) => {
    const { icon, label, selected, className, onClick } = props;

    const rootClassName = cn(styles.root, className, {
      [styles.selected]: selected,
    });

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyPress={onClick}
        className={rootClassName}
      >
        <div className={styles.label}>{label}</div>
        <Icon name={icon} className={styles.icon} />
      </div>
    );
  }
);
