import React from 'react';
import { useTranslation } from 'next-i18next';

import { SubjectRule } from 'astro_2.0/features/CreateDao/components/SubjectRule';
import { TemplateRules } from 'astro_2.0/features/CreateDao/components/TemplateRules/TemplateRules';
import { DAO_RULES_INFO } from 'astro_2.0/features/CreateDao/components/data';

import styles from './DaoRulesForm.module.scss';

export function DaoRulesForm(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2>{t('createDAONew.daoRules.daoSetRules')}</h2>
        <p>{t('createDAONew.daoRules.daoSetRulesDescription')}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.rules}>
          {DAO_RULES_INFO.map(({ subject, title, subTitle }) => (
            <SubjectRule
              key={title}
              title={title}
              subTitle={subTitle}
              subject={subject}
            />
          ))}
        </div>
        <div className={styles.nav}>
          <div className={styles.navHeader}>
            {t('createDAONew.daoRules.daoSetRulesChooseATemplate')}
          </div>
          <TemplateRules />
        </div>
      </div>
    </div>
  );
}
