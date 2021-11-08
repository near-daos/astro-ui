import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import {
  SettingsPage,
  SettingsPageProps,
} from 'pages/dao/[dao]/governance/settings/SettingsPage';

export const getServerSideProps: GetServerSideProps<SettingsPageProps> = async ({
  query,
}) => {
  const dao = await SputnikHttpService.getDaoById(query.dao as string);

  if (!dao) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      dao,
    },
  };
};

export default SettingsPage;
