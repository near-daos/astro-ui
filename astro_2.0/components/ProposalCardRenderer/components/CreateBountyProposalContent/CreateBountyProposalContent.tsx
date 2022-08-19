import React from 'react';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { TokenWidget } from 'astro_2.0/components/TokenWidget';
import { Token } from 'types/token';
import styles from './CreateBountyProposalContent.module.scss';

interface CreateBountyProposalContentProps {
  amount: string;
  token: Token;
  availableClaims: string;
  daysToComplete: string;
}

export const CreateBountyProposalContent: React.FC<
  CreateBountyProposalContentProps
> = ({ amount, token, availableClaims, daysToComplete }) => {
  const infos = [
    {
      label: 'Amount',
      value: (
        <TokenWidget
          icon={token.icon}
          symbol={token.symbol}
          amount={amount}
          decimals={token.decimals}
        />
      ),
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
