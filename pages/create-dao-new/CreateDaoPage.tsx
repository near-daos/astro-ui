import React, { ReactNode } from 'react';

import { CreateDao } from 'astro_2.0/features/CreateDao';
import { Page } from 'pages/_app';
import { MainLayout } from 'astro_3.0/features/MainLayout';

const CreateDaoPage: Page = () => {
  return <CreateDao defaultFlag="/flags/defaultDaoFlag.png" />;
};

CreateDaoPage.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default CreateDaoPage;
