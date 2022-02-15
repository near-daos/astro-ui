import React, { VFC } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { CREATE_GOV_TOKEN_PAGE_URL } from 'constants/routing';
import { STEPS } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/constants';

import { Button } from 'components/button/Button';
import { Accordion } from 'astro_2.0/components/Accordion';
import { SubHeader } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/SubHeader';

import { AdvantageDescription } from './components/AdvantageDescription';

import styles from './Intro.module.scss';

export const Intro: VFC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const { dao } = router.query;

  return (
    <div className={styles.root}>
      <div className={styles.description}>
        {t('createGovernanceTokenPage.intro.description')}
      </div>
      <div className={styles.advantageContainer}>
        <AdvantageDescription className={styles.advantage} icon="treasuryOne">
          {t('createGovernanceTokenPage.intro.advOne')}
        </AdvantageDescription>
        <AdvantageDescription className={styles.advantage} icon="treasuryTwo">
          {t('createGovernanceTokenPage.intro.advTwo')}
        </AdvantageDescription>
        <AdvantageDescription className={styles.advantage} icon="treasuryThree">
          {t('createGovernanceTokenPage.intro.advThree')}
        </AdvantageDescription>
      </div>
      <Button
        capitalize
        className={styles.startToCreate}
        href={{
          pathname: CREATE_GOV_TOKEN_PAGE_URL,
          query: {
            dao,
            step: STEPS.SELECT_TOKEN,
          },
        }}
      >
        {t('createGovernanceTokenPage.intro.startToCreate')}
      </Button>

      <SubHeader className={styles.faq}>
        {t('createGovernanceTokenPage.intro.faq')}
      </SubHeader>
      <Accordion
        className={styles.accordion}
        title={t('createGovernanceTokenPage.intro.accordions.first.title')}
      >
        {t('createGovernanceTokenPage.intro.accordions.first.description')}
      </Accordion>
      <Accordion
        className={styles.accordion}
        title={t('createGovernanceTokenPage.intro.accordions.second.title')}
      >
        {t('createGovernanceTokenPage.intro.accordions.second.description')}
      </Accordion>
      <Accordion
        className={styles.accordion}
        title={t('createGovernanceTokenPage.intro.accordions.third.title')}
      >
        {t('createGovernanceTokenPage.intro.accordions.third.description')}
      </Accordion>
    </div>
  );
};
