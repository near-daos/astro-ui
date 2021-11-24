import React, { VFC } from 'react';

import { TERMS_CONDITIONS } from './config';

import styles from './TermsAndConditions.module.scss';
import { Paragraph } from './types';

export const TermsAndConditions: VFC = () => {
  function renderBlock({ title, body }: Paragraph) {
    return (
      <>
        <div className={styles.subHeader}>{title}</div>
        <div className={styles.textBlock}>{body}</div>
      </>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.pageHeader}>ASTRO DAO Terms and Conditions</div>
      <div className={styles.textBlock}>
        These “Terms and Conditions” last material update was made on: 12th
        November, 2021. The Astro DAO allows you to participate, by creating,
        displaying and operating DAOs and is made available to you by
        _________________ (“Company”).
      </div>

      {TERMS_CONDITIONS.map(renderBlock)}
    </div>
  );
};
