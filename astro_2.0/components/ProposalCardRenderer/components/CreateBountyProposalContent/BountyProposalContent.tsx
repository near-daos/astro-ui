import React from 'react';
import { InfoBlockWidget } from 'astro_2.0/components/ProposalCardRenderer/components/InfoBlockWidget';
import { TokenWidget } from 'astro_2.0/components/ProposalCardRenderer/components/TokenWidget';
import styles from './BountyProposalContent.module.scss';

interface CreateBountyProposalContentProps {
  amount: string;
  token: {
    icon: string;
    symbol: string;
  };
  availableClaims: string;
  daysToComplete: string;
}

export const CreateBountyProposalContent: React.FC<CreateBountyProposalContentProps> = ({
  amount,
  token,
  availableClaims,
  daysToComplete,
}) => {
  const infos = [
    {
      label: 'Amount',
      value: amount,
      valueNode: <TokenWidget icon={token.icon} symbol={token.symbol} />,
    },
    { label: 'Available claims', value: availableClaims },
    { label: 'Days to complete', value: daysToComplete },
  ];

  return (
    <div className={styles.root}>
      {infos.map(info => (
        <InfoBlockWidget {...info} key={info.label} />
      ))}
    </div>
  );
};
