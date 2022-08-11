import React, { ReactNode } from 'react';
import Head from 'next/head';

import {
  Paragraph,
  TERMS_CONDITIONS,
} from 'astro_2.0/features/TermsAndConditions';
import { MainLayout } from 'astro_3.0/features/MainLayout';

import { Page } from 'pages/_app';

import styles from './TermsAndConditions.module.scss';

const TermsAndConditions: Page = () => {
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
      <Head>
        <title>ASTRO DAO Terms and Conditions</title>
      </Head>
      <div className={styles.pageHeader}>ASTRO DAO Terms and Conditions</div>
      <div className={styles.textBlock}>
        These “Terms and Conditions” last material update was made on: 12th
        November, 2021. The Astro DAO allows you to participate, by creating,
        displaying and operating DAOs and is made available to you by&nbsp;
        <a
          className={styles.link}
          href="https://astrodao.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          AstroDAO.com
        </a>
        &nbsp;(“Company”).
      </div>

      {TERMS_CONDITIONS.map(renderBlock)}
    </div>
  );
};

TermsAndConditions.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default TermsAndConditions;
