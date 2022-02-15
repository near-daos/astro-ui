import { useRouter } from 'next/router';
import React, { useState, VFC } from 'react';
import { useTranslation } from 'next-i18next';

import { CREATE_GOV_TOKEN_PAGE_URL } from 'constants/routing';
import { STEPS } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/constants';

import { Icon, IconName } from 'components/Icon';

import { Button } from 'components/button/Button';
import { SubHeader } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/SubHeader';

import { TOKEN_OPTIONS } from './constants';

import { TokenOption } from './components/TokenOption';

import styles from './SelectToken.module.scss';

export const SelectToken: VFC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const { dao } = router.query;

  const [option, setOption] = useState(TOKEN_OPTIONS.NEW);

  function renderOption(opt: string, label: string, icon: IconName) {
    return (
      <TokenOption
        icon={icon}
        option={opt}
        setOption={setOption}
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
        {renderOption(TOKEN_OPTIONS.NEW, 'createToken', 'createToken')}
        {renderOption(TOKEN_OPTIONS.EXISTING, 'chooseExisting', 'selectToken')}
      </div>

      <div className={styles.nextStepContainer}>
        <Button
          capitalize
          variant="secondary"
          className={styles.nextStepButton}
          href={{
            pathname: CREATE_GOV_TOKEN_PAGE_URL,
            query: {
              dao,
              // TODO provide proper "select token" step
              step: option === TOKEN_OPTIONS.NEW ? STEPS.CREATE_TOKEN : '',
            },
          }}
        >
          {t('createGovernanceTokenPage.selectToken.nextStep')}
          <Icon className={styles.buttonIcon} name="buttonArrowRight" />
        </Button>
      </div>
    </div>
  );
};
