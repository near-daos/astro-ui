import React from 'react';
import 'styles/globals.scss';
import type { AppProps } from 'next/app';
import PageLayout from 'components/page-layout/PageLayout';
import { ModalProvider } from 'components/modal';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <PageLayout>
      <ModalProvider>
        <Component {...pageProps} />
      </ModalProvider>
    </PageLayout>
  );
}

export default MyApp;
