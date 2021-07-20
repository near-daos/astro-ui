import React from 'react';
import { IconButton as IconButtonComponent } from 'components/button/IconButton';
import { Meta } from '@storybook/react';
import RefreshIcon from 'assets/button/refresh.svg';
import RefreshPressedIcon from 'assets/button/refresh-pressed.svg';

export const IconButton = (): JSX.Element => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div>
      <style jsx>
        {`
          div {
            display: flex;
            gap: 1em;
          }
        `}
      </style>
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
