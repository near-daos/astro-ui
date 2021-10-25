import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { SputnikService } from 'services/SputnikService';
import { getActiveProposalsCountByDao } from 'hooks/useAllProposals';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import MyDaosPage from './MyDaosPage';

export const getServerSideProps: GetServerSideProps = async () => {
  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const accountDaosPromise = account
    ? SputnikService.getAccountDaos(account)
    : Promise.resolve([]);

  const [accountDaos, proposals] = await Promise.all([
    accountDaosPromise,
    SputnikService.getProposals(undefined, 0, 500)
  ]);

  const activeProposalsByDao = getActiveProposalsCountByDao(proposals);

  return {
    props: {
      accountDaos: accountDaos.map(item => ({
        ...item,
        proposals: activeProposalsByDao[item.id] ?? 0
      }))
    }
  };
};

export default MyDaosPage;
