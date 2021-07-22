import React from 'react';
import { IconButton as IconButtonComponent } from 'components/button/IconButton';
import { Meta } from '@storybook/react';
import { Icon } from 'components/Icon';

export const IconButton = (): JSX.Element => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div>
    <IconButtonComponent size="small">
      <Icon name="buttonRefresh" />
    </IconButtonComponent>
    <IconButtonComponent size="medium">
      <Icon name="buttonRefresh" />
    </IconButtonComponent>
    <IconButtonComponent size="large">
      <Icon name="buttonRefresh" />
    </IconButtonComponent>
  </div>
);

export default {
  title: 'Components/Buttons',
  component: IconButtonComponent
} as Meta;
