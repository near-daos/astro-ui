import React from 'react';
import { VotingButton as VotingButtonComponent } from 'components/button/VotingButton';

import { Meta } from '@storybook/react';

export const VotingButton = (): JSX.Element => {
  return (
    <div>
      <VotingButtonComponent type="button" variant="yes">
        Yes
      </VotingButtonComponent>
      <VotingButtonComponent type="button" variant="no">
        No
      </VotingButtonComponent>
      <VotingButtonComponent type="button" variant="spam">
        Spam
      </VotingButtonComponent>
    </div>
  );
};

export default {
  title: 'Components/Buttons/Voting Button',
  component: VotingButtonComponent
} as Meta;
