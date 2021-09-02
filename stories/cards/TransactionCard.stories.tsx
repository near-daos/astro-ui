import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  TransactionCard,
  TransactionCardProps
} from 'components/cards/transaction-card';
import { TokenName } from 'components/cards/token-card';

export default {
  title: 'Components/cards/TransactionCard',
  component: TransactionCard,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: '#f7f5fc' }}>{story()}</div>
    )
  ]
} as Meta;

const Template: Story<TransactionCardProps> = (args): JSX.Element => (
  <TransactionCard {...args} />
);

export const DepositTransaction = Template.bind({});

DepositTransaction.storyName = 'Deposit';
DepositTransaction.args = {
  tokenName: TokenName.NEAR,
  type: 'Deposit',
  tokensBalance: 678,
  date: new Date().toISOString(),
  accountName: 'verylongnamegoeshere.near'
};

export const WithdrawTransaction = Template.bind({});

WithdrawTransaction.storyName = 'Withdraw';
WithdrawTransaction.args = {
  tokenName: TokenName.NEAR,
  type: 'Withdraw',
  tokensBalance: 458,
  date: new Date().toISOString(),
  accountName: 'verylongnamegoeshere.near'
};
