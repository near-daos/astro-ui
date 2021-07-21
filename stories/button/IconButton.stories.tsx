import React from 'react';
import { IconButton as IconButtonComponent } from 'components/button/IconButton';
import { Meta } from '@storybook/react';
import RefreshIcon, { ReactComponent } from 'assets/button/refresh.svg';
import RefreshPressedIcon from 'assets/button/refresh-pressed.svg';
import styles from './btn.module.scss';

export const IconButton = (): JSX.Element => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div>
      <div className={styles.test}>
        <ReactComponent />
      </div>
      <IconButtonComponent
        icon={RefreshIcon}
        activeIcon={RefreshPressedIcon}
        size="small"
      />
      <IconButtonComponent
        icon={RefreshIcon}
        activeIcon={RefreshPressedIcon}
        size="medium"
      />
      <IconButtonComponent
        icon={RefreshIcon}
        activeIcon={RefreshPressedIcon}
        size="large"
      />
    </div>
  );
};

export default {
  title: 'Components/Buttons',
  component: IconButtonComponent
} as Meta;
