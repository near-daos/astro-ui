import React from 'react';

import { Meta, Story } from '@storybook/react';

import {
  DaoDetailsPopup,
  DaoDetailsPopupProps
} from 'features/dao-home/components/dao-details-popup/DaoDetailsPopup';

export default {
  title: 'Features/DAO Home/Popups/DaoDetailsPopup',

  component: DaoDetailsPopup
} as Meta;

export const Template: Story<DaoDetailsPopupProps> = (args): JSX.Element => (
  <DaoDetailsPopup {...args} />
);

Template.storyName = 'DaoDetailsPopup';

Template.args = {
  isOpen: true,
  title: 'Meowzers',
  subtitle: 'meowzers.sputnikdao.near',
  createdAt: '12.03.2021',
  links: [
    {
      type: 'AnyUrl',
      url: 'http://example.com'
    },
    {
      type: 'Discord',
      url: 'http://example.com'
    },
    {
      type: 'Twitter',
      url: 'http://example.com'
    }
  ],
  children: (
    <div>
      <p>
        We give community grants to artists who want to build projects on our
        platform. Join our Discord channel to stay up to date with latest info!
      </p>
      <p>
        Our process for creating grant submissions can be viewed on our Discord
        server. Please reach out to our community organizers with any questions
        you might have!
      </p>
      <p>
        We’ve been awarding projects since January 2021 and have distributed
        over 20k in total so far.
      </p>
    </div>
  )
};
