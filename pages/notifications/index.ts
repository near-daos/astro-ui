import { GetServerSideProps } from 'next';
import nextI18NextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { NotificationsService } from 'services/NotificationsService';

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const notifications = await NotificationsService.getNotifications();

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
      notifications,
    },
  };
};

export { default } from './NotificationsPage';
