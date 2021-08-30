import CreateLayout from 'components/create-layout/CreateLayout';
import { ModalProvider } from 'components/modal';
import PageLayout from 'components/page-layout/PageLayout';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React from 'react';
import 'styles/globals.scss';

function usePageLayout(): React.FC {
  const router = useRouter();

  if (router.route.match('/create-dao')) {
    return CreateLayout;
  }

  return PageLayout;
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const Layout = usePageLayout();

  return (
    <ModalProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ModalProvider>
  );
}

export default MyApp;
