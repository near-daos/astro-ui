import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  TransactionCard,
  TransactionCardProps
} from 'components/cards/transaction-card';
import { Token } from 'types/token';

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
  tokenName: Token.NEAR,
  type: 'Deposit',
  date: new Date().toISOString(),
  accountName: 'verylongnamegoeshere.near'
};

export const WithdrawTransaction = Template.bind({});

WithdrawTransaction.storyName = 'Withdraw';
WithdrawTransaction.args = {
  tokenName: Token.NEAR,
  type: 'Withdraw',
  date: new Date().toISOString(),
  accountName: 'verylongnamegoeshere.near'
};
