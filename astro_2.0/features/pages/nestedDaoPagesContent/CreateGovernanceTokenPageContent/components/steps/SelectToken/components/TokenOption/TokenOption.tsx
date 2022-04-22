import { VFC } from 'react';
import cn from 'classnames';

import { Icon, IconName } from 'components/Icon';

import { CreateGovernanceTokenFlow } from 'types/settings';

import styles from './TokenOption.module.scss';

interface TokenOptionProps {
  label: string;
  option: CreateGovernanceTokenFlow;
  icon: IconName;
  selected: boolean;
  className?: string;
  setOption: (opt: CreateGovernanceTokenFlow) => void;
}

export const TokenOption: VFC<TokenOptionProps> = props => {
  const { icon, label, selected, option, className, setOption } = props;

  function onClick() {
    setOption(option);
  }

  const rootClassName = cn(styles.root, className, {
    [styles.selected]: selected,
  });

  return (
    <div
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
};
