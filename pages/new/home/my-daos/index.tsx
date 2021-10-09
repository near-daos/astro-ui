import React, { FC } from 'react';

import DaoCard from 'components/cards/dao-card';

import { useAccountData } from 'features/account-data';

import { formatCurrency } from 'utils/formatCurrency';

import { useNearPrice } from 'hooks/useNearPrice';

import styles from './MyDaos.module.scss';

const MyDaosPage: FC = () => {
  const nearPrice = useNearPrice();
  const { accountDaos } = useAccountData();

  function renderDaos() {
    return accountDaos.map(dao => {
      const { id, logo, name, description, proposals, members, funds } = dao;

      return (
        <DaoCard
          key={id}
          flag={logo}
          title={name}
          daoAccountName={id}
          description={description}
          activeProposals={proposals ?? 0}
          funds={formatCurrency(parseFloat(funds) * nearPrice)}
          members={members}
        />
      );
    });
  }

  return (
    <div className={styles.root}>
      <h1>My DAOs</h1>
      <div className={styles.daos}>{renderDaos()}</div>
    </div>
  );
};

export default MyDaosPage;
