import React from 'react';
import Head from 'next/head';
import { App404 } from 'features/app-404';
import { NextPage } from 'next';

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
