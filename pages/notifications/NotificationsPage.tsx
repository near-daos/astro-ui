import React, { ReactNode } from 'react';

import { UserContacts } from 'services/NotificationsService/types';

import { MainLayout } from 'astro_3.0/features/MainLayout';

import { Page } from 'pages/_app';

import { useFlags } from 'launchdarkly-react-client-sdk';
import { NotificationsPageContent } from 'astro_3.0/features/NotificationsPageContent';
import { NotificationsPageView } from 'astro_2.0/features/Notifications/components/NotificationsPageView';

export interface NotificationsPageProps {
  config: UserContacts;
}

const NotificationsPage: Page<NotificationsPageProps> = ({ config }) => {
  const { useOpenSearchDataApiNotifications } = useFlags();

  if (useOpenSearchDataApiNotifications === undefined) {
    return null;
  }

  return useOpenSearchDataApiNotifications ? (
    <NotificationsPageContent config={config} />
  ) : (
    <NotificationsPageView config={config} />
  );
};

NotificationsPage.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default NotificationsPage;
