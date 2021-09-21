import CreateLayout from 'components/create-layout/CreateLayout';

import { ModalProvider } from 'components/modal';
import PageLayout from 'components/page-layout/PageLayout';

import { AuthWrapper } from 'context/AuthContext';
import { useDAOList } from 'hooks/useDAOList';
import { useDaoListPerCurrentUser } from 'hooks/useDaoListPerCurrentUser';
import isEmpty from 'lodash/isEmpty';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMount } from 'react-use';

import { SputnikService } from 'services/SputnikService';
import 'styles/globals.scss';
import { SWRConfig } from 'swr';

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
    await SputnikService.init();
    setWalletInitialized(true);
  });

  const { isLoading: isLoadingDAOList, daos } = useDAOList(walletInitialized);
  const { daos: userDaos } = useDaoListPerCurrentUser(walletInitialized);

  useEffect(() => {
    if (!isLoadingDAOList && isEmpty(userDaos)) {
      router.push('/all-communities');
    }
    // eslint-disable-next-line
  }, [isLoadingDAOList]);

  if (walletInitialized && !isLoadingDAOList) {
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
