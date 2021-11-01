import React from 'react';
import { Button } from 'components/button/Button';
import { InfoBlockWidget } from 'astro_2.0/components/ProposalCardRenderer/components/InfoBlockWidget';
import { TokenWidget } from 'astro_2.0/components/ProposalCardRenderer/components/TokenWidget';
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
    { label: 'Bond', value: bond },
    { label: 'Gas', value: gas },
  ];

  return (
    <div className={styles.root}>
      {infos.map(info => (
        <InfoBlockWidget
          label={info.label}
          value={info.value}
          valueNode={<TokenWidget icon="" symbol="NEAR" />}
          key={info.label}
        />
      ))}
      <div>
        <Button variant="black" size="medium" onClick={onCreate}>
          Propose
        </Button>
      </div>
    </div>
  );
};
