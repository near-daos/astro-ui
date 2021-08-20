import React from 'react';
import { Meta, Story } from '@storybook/react';
import { GroupPopup, GroupPopupProps } from 'features/groups';
import { GroupFormType } from 'features/groups/types';

export default {
  title: 'Features/Groups/GroupPopup',
  component: GroupPopup,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: 'lightgrey' }}>{story()}</div>
    )
  ]
} as Meta;

const Template: Story<GroupPopupProps> = args => <GroupPopup {...args} />;

export const NewGroup = Template.bind({});

NewGroup.storyName = 'NewGroup popup';
NewGroup.args = {
  isOpen: true,
  initialValues: {
    groupType: GroupFormType.CREATE_GROUP,
    groups: [],
    voteDetails: [
      { value: '50%', label: 'MEW holders' },
      { value: '50%', label: 'cool group' },
      { value: '1 person', label: 'Ombudspeople' }
    ],
    bondDetail: {
      value: 0.3,
      token: 'NEAR'
    }
  }
};

export const AddMemberGroup = Template.bind({});

AddMemberGroup.storyName = 'Add Member to group popup';
AddMemberGroup.args = {
  isOpen: true,
  initialValues: {
    groupType: GroupFormType.ADD_TO_GROUP,
    groups: [],
    voteDetails: [
      { value: '50%', label: 'MEW holders' },
      { value: '50%', label: 'cool group' },
      { value: '1 person', label: 'Ombudspeople' }
    ],
    bondDetail: {
      value: 0.3,
      token: 'NEAR'
    }
  }
};

export const RemoveMemberFromGroup = Template.bind({});

RemoveMemberFromGroup.storyName = 'Remove Member from the popup';
RemoveMemberFromGroup.args = {
  isOpen: true,
  initialValues: {
    groupType: GroupFormType.REMOVE_FROM_GROUP,
    groups: [],
    voteDetails: [
      { value: '50%', label: 'MEW holders' },
      { value: '50%', label: 'cool group' },
      { value: '1 person', label: 'Ombudspeople' }
    ],
    bondDetail: {
      value: 0.3,
      token: 'NEAR'
    }
  }
};
