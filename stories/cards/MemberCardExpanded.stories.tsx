import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Badge } from 'components/Badge';
import {
  MemberCardPopup,
  MemberCardPopupProps,
} from 'components/cards/member-card/MemberCardPopup';

export default {
  title: 'Components/Cards/MemberCardExpanded',
  component: MemberCardPopup,
} as Meta;

export const Template: Story<MemberCardPopupProps> = (args): JSX.Element => (
  <MemberCardPopup {...args}>
    <Badge size="small" variant="green">
      Atos
    </Badge>
    <Badge size="large" variant="orange">
      Portos
    </Badge>
    <Badge size="medium">Aramis</Badge>
    <Badge size="medium" variant="turqoise">
      d&apos;Artagnan
    </Badge>
  </MemberCardPopup>
);

Template.storyName = 'MemberCardExpanded';
Template.args = {
  title: 'jonasteam.near',
  votes: 23,
  isOpen: true,
  tokens: {
    value: 5,
    symbol: 'MEW',
  },
};
