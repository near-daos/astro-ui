import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { DaoSettingsView } from 'features/dao-settings';
import { DAO } from 'types/dao';

export const getServerSideProps: GetServerSideProps = async ({
  query,
}): Promise<{
  props: { data: DAO | null };
}> => {
  const data = await SputnikHttpService.getDaoById(query.dao as string);

  return {
    props: {
      data,
    },
  };
};

export default DaoSettingsView;
