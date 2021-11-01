import React from 'react';
import { SubjectRule } from 'astro_2.0/features/CreateDao/components/SubjectRule/SubjectRule';
import { TemplateRules } from 'astro_2.0/features/CreateDao/components/TemplateRules/TemplateRules';
import {
  DAO_RULES_INFO,
  DAO_TEMPLATES,
} from 'astro_2.0/features/CreateDao/components/units/data';
import styles from './DaoRulesForm.module.scss';

export function DaoRulesForm(): JSX.Element {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2>Set rules for your DAO</h2>
        <p>All fields bellow, unless otherwise noted are required.</p>
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
          <div className={styles.navHeader}>Choose a template</div>
          <TemplateRules templates={DAO_TEMPLATES} />
        </div>
      </div>
    </div>
  );
}
