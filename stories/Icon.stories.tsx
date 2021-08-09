import React from 'react';
import { Meta } from '@storybook/react';
import { Icon } from 'components/Icon';

import * as icons from 'assets/icons';

export type IconName = keyof typeof icons;

export default {
  title: 'Components/Icon',
  component: Icon
} as Meta;

export const Template = (): JSX.Element => (
  <ul style={{ listStyle: 'none' }}>
    {Object.keys(icons).map(key => (
      <li
        style={{
          margin: '8px 0',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Icon name={key as IconName} width={24} />
        <span style={{ marginLeft: 24 }}>{key}</span>
      </li>
    ))}
  </ul>
);

Template.storyName = 'Icon';
Template.args = {
  label: 'Label',
  placeholder: 'Sample text'
};
