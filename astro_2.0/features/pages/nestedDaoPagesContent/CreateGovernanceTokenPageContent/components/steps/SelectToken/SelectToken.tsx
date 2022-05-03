import React, { FC, useState } from 'react';
import { useTranslation } from 'next-i18next';

import {
  CreateGovernanceTokenFlow,
  CreateGovernanceTokenSteps,
} from 'types/settings';

import { Icon, IconName } from 'components/Icon';
import { Button } from 'components/button/Button';
import { SubHeader } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/SubHeader';
import { TokenOption } from './components/TokenOption';

import styles from './SelectToken.module.scss';

interface Props {
  onUpdate: ({
    step,
    proposalId,
    flow,
  }: {
    step: CreateGovernanceTokenSteps | null;
    proposalId: number | null;
    flow: CreateGovernanceTokenFlow;
  }) => Promise<void>;
}

export const SelectToken: FC<Props> = ({ onUpdate }) => {
  const { t } = useTranslation();

  const [option, setOption] = useState<CreateGovernanceTokenFlow>(
    CreateGovernanceTokenFlow.CreateToken
  );

  function renderOption(
    opt: CreateGovernanceTokenFlow,
    label: string,
    icon: IconName
  ) {
    return (
      <TokenOption
        icon={icon}
        option={opt}
        setOption={val => setOption(val)}
        className={styles.option}
        selected={option === opt}
        label={t(`createGovernanceTokenPage.selectToken.${label}`)}
      />
    );
  }

  return (
    <div className={styles.root}>
      <SubHeader>{t('createGovernanceTokenPage.selectToken.header')}</SubHeader>

      <div className={styles.optionsContainer}>
        {renderOption(
          CreateGovernanceTokenFlow.CreateToken,
          'createToken',
          'createToken'
        )}
        {renderOption(
          CreateGovernanceTokenFlow.SelectToken,
          'chooseExisting',
          'selectToken'
        )}
      </div>

      <div className={styles.nextStepContainer}>
        <Button
          capitalize
          variant="secondary"
          className={styles.nextStepButton}
          onClick={async () => {
            await onUpdate({
              step: CreateGovernanceTokenSteps.CreateToken,
              proposalId: null,
              flow: option,
            });
          }}
        >
          {t('createGovernanceTokenPage.selectToken.nextStep')}
          <Icon className={styles.buttonIcon} name="buttonArrowRight" />
        </Button>
      </div>
    </div>
  );
};
