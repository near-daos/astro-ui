import React, { FC } from 'react';

import DaoCard from 'components/cards/dao-card';

import { formatCurrency } from 'utils/formatCurrency';

import { useNearPrice } from 'hooks/useNearPrice';

import { DAO } from 'types/dao';
import styles from './MyDaosPage.module.scss';

interface MyDaosPageProps {
  accountDaos: DAO[];
}

const MyDaosPage: FC<MyDaosPageProps> = ({ accountDaos }) => {
  const nearPrice = useNearPrice();

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
