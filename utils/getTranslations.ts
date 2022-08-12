import { SSRConfig } from 'next-i18next';
import nextI18NextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getTranslations(locale: string): Promise<SSRConfig> {
  return serverSideTranslations(
    locale,
    ['common', 'notificationsPage'],
    nextI18NextConfig
  );
}
