import React from 'react';
import 'styles/globals.scss';
import type { AppProps } from 'next/app';
import PageLayout from 'components/page-layout/PageLayout';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <PageLayout>
      <Component {...pageProps} />
    </PageLayout>
  );
}

export default MyApp;
