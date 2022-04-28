import React from 'react';
import Head from 'next/head';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';

const Custom500Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Internal server error</title>
      </Head>
      <h3>Internal server error</h3>
    </>
  );
};

export default Custom500Page;

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
    },
  };
};
