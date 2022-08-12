import React from 'react';
import Head from 'next/head';
import { GetStaticProps, NextPage } from 'next';
import { getTranslations } from 'utils/getTranslations';

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
      ...(await getTranslations(locale)),
    },
  };
};
