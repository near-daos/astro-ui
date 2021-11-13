import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { SettingsPageProps } from './SettingsPage';

export const getServerSideProps: GetServerSideProps<SettingsPageProps> = async ({
  query,
}) => {
  const [dao, policyAffectsProposals] = await Promise.all([
    SputnikHttpService.getDaoById(query.dao as string),
    SputnikHttpService.findPolicyAffectsProposals(query.dao as string),
  ]);

  if (!dao) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      dao,
      policyAffectsProposals,
    },
  };
};

export { default } from './SettingsPage';
