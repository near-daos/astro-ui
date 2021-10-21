import React from 'react';
import classNames from 'classnames';
import { Icon } from 'components/Icon';
import { format, parseISO } from 'date-fns';
import { TransactionType } from 'lib/types/treasury';
import { TokenDeprecated } from 'types/token';
import s from './transaction-card.module.scss';

export interface TransactionCardProps {
  type: TransactionType;
  tokenName: TokenDeprecated;
  deposit: string;
  date: string;
  accountName: string;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  tokenName,
  type,
  deposit,
  date,
  accountName
}) => {
  return (
    <div className={s.root}>
      <div
        className={classNames(s.icon, {
          [s.purple]: type === 'Deposit',
          [s.green]: type === 'Withdraw'
        })}
      >
        <Icon
          className={s.container}
          name={
            type === 'Deposit' ? 'proposalReceivedFunds' : 'proposalSendFunds'
          }
        />
      </div>
      <div className={s.token}>
        <div className={s.balance}>{`${
          type === 'Deposit' ? '+' : '−'
        } ${deposit}`}</div>
        <div>&nbsp;</div>
        <div className={s.name}>{tokenName}</div>
      </div>

      <div className={s.date}>{format(parseISO(date), 'dd.LL.yyyy hh:mm')}</div>
      <div className={s.account}>{accountName}</div>
    </div>
  );
};
