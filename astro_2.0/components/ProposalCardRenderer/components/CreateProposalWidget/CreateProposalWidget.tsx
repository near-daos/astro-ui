import React from 'react';
import { Button } from 'components/button/Button';
import styles from './CreateProposalWidget.module.scss';

interface CreateProposalWidgetProps {
  onCreate: () => void;
  bond: string;
  gas: string;
}

export const CreateProposalWidget: React.FC<CreateProposalWidgetProps> = ({
  onCreate,
  bond,
  gas,
}) => {
  const infos = [
    { label: 'BOND', value: bond },
    { label: 'GAS', value: gas },
  ];

  return (
    <div className={styles.root}>
      {infos.map(info => (
        <div className={styles.infoBlock} key={info.label}>
          <div className={styles.label}> {info.label}</div>
          <div className={styles.nearValue}>
            <div className={styles.number}>{info.value} </div>
            <div className={styles.value}>NEAR</div>
          </div>
        </div>
      ))}
      <div>
        <Button variant="black" size="medium" onClick={onCreate}>
          Propose
        </Button>
      </div>
    </div>
  );
};
