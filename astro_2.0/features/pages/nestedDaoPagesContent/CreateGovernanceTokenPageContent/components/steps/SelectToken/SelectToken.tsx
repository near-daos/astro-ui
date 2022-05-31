import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { FC, useCallback, useState } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';

import {
  CreateGovernanceTokenFlow,
  CreateGovernanceTokenSteps,
} from 'types/settings';

import { CREATE_GOV_TOKEN_UNDER_CONSTRUCTION } from 'constants/routing';

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
  const tBase = 'createGovernanceTokenPage.selectToken';

  const router = useRouter();
  const { createGovernanceToken } = useFlags();

  const [option, setOption] = useState<CreateGovernanceTokenFlow>(
    CreateGovernanceTokenFlow.SelectToken
  );

  const navigateToUnderConstruction = useCallback(
    () =>
      router.push({
        pathname: CREATE_GOV_TOKEN_UNDER_CONSTRUCTION,
        query: {
          dao: router.query.dao,
        },
      }),
    [router]
  );

  const selectCreateToken = useCallback(
    () => setOption(CreateGovernanceTokenFlow.CreateToken),
    []
  );

  const selectSelectToken = useCallback(
    () => setOption(CreateGovernanceTokenFlow.SelectToken),
    []
  );

  function renderOption(
    opt: CreateGovernanceTokenFlow,
    label: string,
    icon: IconName,
    onClick: () => void
  ) {
    return (
      <TokenOption
        icon={icon}
        onClick={onClick}
        className={styles.option}
        selected={option === opt}
        label={t(`createGovernanceTokenPage.selectToken.${label}`)}
      />
    );
  }

  return (
    <div className={styles.root}>
      <SubHeader>{t(`${tBase}.header`)}</SubHeader>
      <div className={styles.optionsContainer}>
        {renderOption(
          CreateGovernanceTokenFlow.CreateToken,
          'createToken',
          'createToken',
          createGovernanceToken
            ? selectCreateToken
            : navigateToUnderConstruction
        )}
        {renderOption(
          CreateGovernanceTokenFlow.SelectToken,
          'chooseExisting',
          'selectToken',
          selectSelectToken
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
          {t(`${tBase}.nextStep`)}
          <Icon className={styles.buttonIcon} name="buttonArrowRight" />
        </Button>
      </div>
    </div>
  );
};
