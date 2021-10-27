import { Meta } from '@storybook/react';

import * as icons from 'assets/icons';
import { Icon } from 'components/Icon';
import React from 'react';

export type IconName = keyof typeof icons;

export default {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
} as Meta;

export const Template = (): JSX.Element => (
  <ul style={{ listStyle: 'none' }}>
    {Object.keys(icons).map(key => (
      <li
        style={{
          margin: '8px 0',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Icon name={key as IconName} width={40} />
        <span style={{ marginLeft: 24 }}>{key}</span>
      </li>
    ))}
  </ul>
);

Template.storyName = 'Icon';
