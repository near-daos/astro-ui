import { GetServerSideProps } from 'next';
import { SputnikService } from 'services/SputnikService';
import { DaoSettingsView } from 'features/dao-settings';
import { DAO } from 'types/dao';

export const getServerSideProps: GetServerSideProps = async ({
  query
}): Promise<{
  props: { data: DAO | null };
}> => {
  const data = await SputnikService.getDaoById(query.dao as string);

  return {
    props: {
      data
    }
  };
};

export default DaoSettingsView;
