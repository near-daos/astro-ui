import React from 'react';
import classNames from 'classnames';
import { Icon } from 'components/Icon';
import { format, parseISO } from 'date-fns';
import { ExplorerLink } from 'components/explorer-link';
import s from './transaction-card.module.scss';

export interface TransactionCardProps {
  type: 'Deposit' | 'Withdraw';
  tokenName: string;
  deposit: string;
  date: string;
  accountName: string;
  txHash: string;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  tokenName,
  type,
  deposit,
  date,
  accountName,
  txHash,
}) => {
  return (
    <div className={s.root}>
      <ExplorerLink
        linkData={txHash}
        linkType="transaction"
        className={s.explorerLink}
        isAbsolute
      />
      <div
        className={classNames(s.icon, {
          [s.deposit]: type === 'Deposit',
          [s.withdraw]: type === 'Withdraw',
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
