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
          [s.deposit]: type === 'Deposit',
          [s.withdraw]: type === 'Withdraw'
        })}
      >
        <Icon
          name={
            type === 'Deposit' ? 'proposalReceivedFunds' : 'proposalSendFunds'
          }
          width={24}
          className={s.container}
        />
      </div>
      <div className={s.token}>
        <span className={s.balance}>{`${
          type === 'Deposit' ? '+' : '−'
        } ${deposit}`}</span>{' '}
        <span className={s.name}>{tokenName}</span>
      </div>
      <div className={s.account}>{accountName}</div>
      <div className={s.date}>{format(parseISO(date), 'dd.LL.yyyy hh:mm')}</div>
    </div>
  );
};
