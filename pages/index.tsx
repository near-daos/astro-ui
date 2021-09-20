import 'assets/icons';
import { GetServerSideProps } from 'next';
import React from 'react';
import { SputnikService } from 'services/SputnikService';
import { DAO } from 'types/dao';

export default function RootPage(): JSX.Element {
  return <div />;
}

export const getServerSideProps: GetServerSideProps<{
  fallback: { '/daos': DAO[] };
}> = async ({ res }) => {
  const data = await SputnikService.getDaoList();

  if (data.length === 0) {
    res.statusCode = 302;
    res.setHeader('location', `/all-communities`);
  }

  return {
    props: {
      fallback: {
        '/daos': data
      }
    }
  };
};
