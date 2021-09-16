import React from 'react';
import { Meta, Story } from '@storybook/react';
import { VoteDetails, VoteDetailsProps } from 'components/vote-details';

export default {
  title: 'components/VoteDetails',
  component: VoteDetails,
  decorators: [
    story => (
      <div
        style={{ padding: '1rem', background: 'lightgrey', maxWidth: '1024px' }}
      >
        {story()}
      </div>
    )
  ]
} as Meta;

const Template: Story<VoteDetailsProps> = args => <VoteDetails {...args} />;

export const Default = Template.bind({});

Default.args = {
  voteDetails: [
    {
      limit: '60%',
      label: 'MEW holders',
      data: [
        {
          vote: 'Yes',
          percent: 1.2
        },
        {
          vote: 'No',
          percent: 2.7
        },
        {
          vote: 'Trash',
          percent: 0.4
        }
      ]
    },
    {
      limit: '80%',
      label: 'Cool group',
      data: [
        {
          vote: 'Yes',
          percent: 4.5
        },
        {
          vote: 'No',
          percent: 2.3
        },
        {
          vote: 'Trash',
          percent: 1.1
        }
      ]
    },
    { limit: '1 person', label: 'Ombudspeople' }
  ],
  votersList: [
    { name: 'masked.near', vote: 'Yes' },
    { name: 'colllectiveofeveryone.near', vote: 'No' },
    { name: 'helllo23.near', vote: 'Yes' },
    { name: 'user9765.near', vote: 'Trash' },
    { name: 'jonathan.near', vote: 'Yes' },
    { name: 'verylongusername.near', vote: 'No' },
    { name: 'lydiatran.near', vote: 'Trash' },
    { name: '9997thrt.near', vote: 'Yes' },
    { name: 'masked123.near', vote: 'Yes' },
    { name: 'colllectiveofeveryone423.near', vote: 'No' },
    { name: 'helllo23567.near', vote: 'Yes' },
    { name: 'user976542.near', vote: 'Trash' }
  ],
  bondDetail: {
    value: 0.3,
    token: 'NEAR'
  },
  showProgress: false
};

export const VoteProgress = Template.bind({});

VoteProgress.args = {
  voteDetails: [
    {
      limit: '50%',
      label: 'Council',
      data: [
        {
          vote: 'Yes',
          percent: 52.2
        },
        {
          vote: 'No',
          percent: 8.7
        },
        {
          vote: 'Trash',
          percent: 4.4
        }
      ]
    },
    {
      limit: '70%',
      label: 'Grants Committee',
      data: [
        {
          vote: 'Yes',
          percent: 17.1
        },
        {
          vote: 'No',
          percent: 58.3
        },
        {
          vote: 'Trash',
          percent: 8.7
        }
      ]
    },
    { limit: '1 person', label: 'MEW token holders' }
  ],
  votersList: [
    { name: 'jonathan1.near', vote: 'Yes' },
    { name: 'verylongusername2.near', vote: 'No' },
    { name: 'lydiatran3.near', vote: 'Trash' },
    { name: '9997thrt4.near', vote: 'Yes' },
    { name: 'masked5.near', vote: 'Yes' },
    { name: 'colllectiveofeveryone6.near', vote: 'No' },
    { name: 'helllo237.near', vote: 'Yes' },
    { name: 'user97658.near', vote: 'Trash' },
    { name: 'jonathan9.near', vote: 'Yes' },
    { name: 'verylongusername10.near', vote: 'No' },
    { name: 'lydiatran11.near', vote: 'Trash' },
    { name: '9997thrt12.near', vote: 'Yes' },
    { name: 'masked13.near', vote: 'Yes' },
    { name: 'colllectiveofeveryone14.near', vote: 'No' },
    { name: 'helllo2315.near', vote: 'Yes' },
    { name: 'user976516.near', vote: 'Trash' }
  ],
  bondDetail: {
    value: 0.5,
    token: 'NEAR'
  },
  showProgress: true
};

export const VoteProgressOneGroup = Template.bind({});

VoteProgressOneGroup.args = {
  voteDetails: [
    {
      limit: '60%',
      label: 'PAW Patrol',
      data: [
        {
          vote: 'Yes',
          percent: 33.3
        },
        {
          vote: 'No',
          percent: 16.6
        },
        {
          vote: 'Trash',
          percent: 8.3
        }
      ]
    }
  ],
  votersList: [
    { name: 'jonathan1.near', vote: 'Yes' },
    { name: 'verylongusername2.near', vote: 'No' },
    { name: 'lydiatran3.near', vote: 'Trash' },
    { name: 'jonathan4.near', vote: 'Yes' },
    { name: '9997thrt5.near', vote: 'Yes' },
    { name: 'verylongusername6.near', vote: 'No' },
    { name: 'lydiatran7.near', vote: 'Trash' },
    { name: 'user97658.near', vote: 'Trash' },
    { name: '9997thrt9.near', vote: 'Yes' },
    { name: 'masked10.near', vote: 'Yes' },
    { name: 'colllectiveofeveryone11.near', vote: 'No' },
    { name: 'helllo2312.near', vote: 'Yes' },
    { name: 'masked13.near', vote: 'Yes' },
    { name: 'colllectiveofeveryone14.near', vote: 'No' },
    { name: 'helllo2315.near', vote: 'Yes' },
    { name: 'user976516.near', vote: 'Trash' }
  ],
  bondDetail: {
    value: 0.2,
    token: 'NEAR'
  },
  showProgress: true
};
