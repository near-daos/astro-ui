import React, { VFC } from 'react';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';

export const AcceptStakingContractContent: VFC = () => {
  const { t } = useTranslation();
  const { watch } = useFormContext();

  const contract = watch('contract');

  return (
    <div>
      <InfoBlockWidget
        label={t('proposalCard.acceptStakingContract.stakingContract')}
        value={contract}
      />
    </div>
  );
};
