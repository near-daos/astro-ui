import React from 'react';
import styles from 'astro_2.0/components/ProposalCardRenderer/components/DaoFlagWidget/DaoFlag.module.scss';

interface DaoFlagProps {
  daoName: string;
  flagUrl: string;
}

export const DaoFlagWidget: React.FC<DaoFlagProps> = ({ daoName, flagUrl }) => {
  return (
    <div className={styles.root}>
      <div className={styles.flag}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={flagUrl} height={52} width={46} alt="DAO flag" />
      </div>
      <div className={styles.info}>
        <div className={styles.label}>DAO name</div>
        <div className={styles.text}>{daoName}</div>
      </div>
    </div>
  );
};
