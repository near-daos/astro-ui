import React from 'react';
import Head from 'next/head';
import { App404 } from 'astro_2.0/features/App404';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';

const Custom404Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>
          We&rsquo;re sorry, the page you&rsquo;re looking for could not be
          found.
        </title>
      </Head>
      <App404 />
    </>
  );
};

export default Custom404Page;

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
