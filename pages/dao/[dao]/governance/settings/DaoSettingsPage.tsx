import { GetServerSideProps } from 'next';
import React, { FC } from 'react';
import { DaoSettingsView } from 'features/dao-settings';
import { SputnikService } from 'services/SputnikService';
import { DAO } from 'types/dao';

const DaoSettingsPage: FC = () => {
  return <DaoSettingsView />;
};

export const getServerSideProps: GetServerSideProps = async ({
  query
}): Promise<{
  props: { data: DAO[] };
}> => {
  const data = await SputnikService.getDaoList(query);

  return {
    props: {
      data
    }
  };
};

export default DaoSettingsPage;
