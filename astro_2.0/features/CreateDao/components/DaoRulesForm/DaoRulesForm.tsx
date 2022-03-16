import React from 'react';
import { useTranslation } from 'next-i18next';

import { SubjectRule } from 'astro_2.0/features/CreateDao/components/SubjectRule';
import { TemplateRules } from 'astro_2.0/features/CreateDao/components/TemplateRules';
import { DAO_RULES_INFO } from 'astro_2.0/features/CreateDao/components/data';

import styles from './DaoRulesForm.module.scss';

export function DaoRulesForm(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2>{t('createDAO.daoRulesForm.daoSetRules')}</h2>
        <p>{t('createDAO.daoRulesForm.daoSetRulesDescription')}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.rules}>
          {DAO_RULES_INFO.map(({ subject, title, subTitle }) => (
            <SubjectRule
              key={title}
              title={t(`createDAO.daoRulesForm.daoRulesSections.${title}`)}
              subTitle={t(
                `createDAO.daoRulesForm.daoRulesSections.${subTitle}`
              )}
              subject={subject}
            />
          ))}
        </div>
        <div className={styles.nav}>
          <div className={styles.navHeader}>
            {t('createDAO.daoRulesForm.daoSetRulesChooseATemplate')}
          </div>
          <TemplateRules />
        </div>
      </div>
    </div>
  );
}
