import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  RequestPayoutPopup,
  RequestPayoutPopupProps
} from 'features/treasury/request-payout-popup';

export default {
  title: 'Features/Treasury/RequestPayout',
  component: RequestPayoutPopup,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: 'lightgrey' }}>{story()}</div>
    )
  ]
} as Meta;

export const Template: Story<RequestPayoutPopupProps> = args => (
  <RequestPayoutPopup {...args} />
);

Template.storyName = 'RequestPayout';
Template.args = {
  isOpen: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose: () => {}
};
