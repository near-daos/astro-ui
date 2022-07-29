import React from 'react';

import { CreateDao } from 'astro_2.0/features/CreateDao';
import { Page } from 'pages/_app';

const CreateDaoPage: Page = () => {
  return <CreateDao defaultFlag="/flags/defaultDaoFlag.png" />;
};

export default CreateDaoPage;
