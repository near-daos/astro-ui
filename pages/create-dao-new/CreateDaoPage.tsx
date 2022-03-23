import { NextPage } from 'next';
import React from 'react';

import { CreateDao } from 'astro_2.0/features/CreateDao';

const CreateDaoPage: NextPage<{ step: string }> = () => {
  return <CreateDao defaultFlag="/flags/defaultDaoFlag.png" />;
};

export default CreateDaoPage;
