import React, { FC } from 'react';
import { useIsValidImage } from 'hooks/useIsValidImage';
import { Icon, IconName } from 'components/Icon';

import styles from './TokenIcon.module.scss';

interface TokenIconProps {
  symbol: string;
  icon: string;
}

export const TokenIcon: FC<TokenIconProps> = ({ symbol, icon }) => {
  let type: 'ICON' | 'URL';
  let iconName: IconName | null;
  let url = '';

  switch (symbol?.toLowerCase()) {
    case 'near':
    case 'wnear': {
      type = 'ICON';
      iconName = 'tokenNearBig';
      break;
    }
    case 'aurora': {
      type = 'ICON';
      iconName = 'aurora';
      break;
    }
    default: {
      type = 'URL';
      iconName = null;
      url = icon;
    }
  }

  const isValid = useIsValidImage(type === 'URL' ? url : '');

  let content = <div className={styles.icon} />;

  if (isValid) {
    content = (
      <div
        style={{
          backgroundImage: `url(${encodeURI(decodeURIComponent(url))})`,
        }}
        className={styles.icon}
      />
    );
  }

  if (type === 'ICON' && iconName) {
    content = <Icon name={iconName} />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.iconWrapper}>{content}</div>
    </div>
  );
};
