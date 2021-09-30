import CreateLayout from 'components/create-layout/CreateLayout';

import { ModalProvider } from 'components/modal';
import PageLayout from 'components/page-layout/PageLayout';

import { AuthWrapper } from 'context/AuthContext';
import { useDaoListPerCurrentUser } from 'hooks/useDaoListPerCurrentUser';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMount } from 'react-use';

import { SputnikService } from 'services/SputnikService';
import 'styles/globals.scss';
import { SWRConfig } from 'swr';
import { useDAOList } from 'hooks/useDAOList';

function usePageLayout(): React.FC {
  const router = useRouter();

  if (router.route.match('/create-dao')) {
    return CreateLayout;
  }

  return PageLayout;
}

function App({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();
  const [walletInitialized, setWalletInitialized] = useState(false);

  const Layout = usePageLayout();

  useMount(async () => {
    SputnikService.init();
    setWalletInitialized(true);
  });

  const { daos } = useDAOList(walletInitialized);
  const { daos: userDaos } = useDaoListPerCurrentUser();

  useEffect(() => {
    if (router.pathname === '/' && userDaos != null && userDaos.length) {
      router.push('/home');
    } else if (router.pathname === '/' && userDaos != null) {
      router.push('/all-communities');
    } else if (!walletInitialized) {
      router.push('/all-communities');
    }
  }, [router, userDaos, walletInitialized]);

  if (walletInitialized) {
    return (
      <SWRConfig value={{ fallback: { '/daos': daos } }}>
        <AuthWrapper>
          <ModalProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ModalProvider>
        </AuthWrapper>
      </SWRConfig>
    );
  }

  return <div />;
}

/* TODO Not works yet. WIP
const getInitialProps: NextPage['getInitialProps'] = ctx => {
  const cookies = nookies.get(ctx);

  nookies.set(ctx, 'selectedDao', 'brand-new-dao.sputnikv2.testnet', {
    maxAge: 30 * 24 * 60 * 60,
    path: '/'
  });

  return { cookies };
};

App.getInitialProps = getInitialProps;
*/

export default App;
