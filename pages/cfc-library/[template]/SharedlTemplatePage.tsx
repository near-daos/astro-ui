import React, { ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import TextTruncate from 'react-text-truncate';
import dynamic from 'next/dynamic';
import cn from 'classnames';
import Link from 'next/link';

import {
  CFC_LIBRARY,
  CFC_LIBRARY_TEMPLATE_VIEW,
  SINGLE_DAO_PAGE,
} from 'constants/routing';

import { BackButton } from 'astro_2.0/features/ViewProposal/components/BackButton';
import { Loader } from 'components/loader';
import { IconButton } from 'components/button/IconButton';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import {
  useCloneCfcTemplate,
  useSharedTemplatePageData,
} from 'astro_2.0/features/pages/cfcLibrary/hooks';

import { Tooltip } from 'astro_2.0/components/Tooltip';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { ApplyToDaos } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard/components/ApplyToDaos';
import { useWalletContext } from 'context/WalletContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { OptionsList } from 'astro_2.0/features/pages/cfcLibrary/components/OptionsList';

import { copyToClipboard } from 'utils/copyToClipboard';

import { DaoFeedItem } from 'types/dao';

import { Page } from 'pages/_app';

import { MainLayout } from 'astro_3.0/features/MainLayout';

import styles from './SharedTemplatePage.module.scss';

const CustomFcTemplateCard = dynamic(
  import(
    'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard'
  ),
  {
    ssr: false,
  }
);

interface Props {
  accountDaos: DaoFeedItem[];
}

const SharedTemplatePage: Page<Props> = ({ accountDaos }) => {
  const { t } = useTranslation();
  const defaultTooltipText = t('copyPageUrl');
  const {
    data,
    loading,
    templateId,
    templatesBySmartContract,
    loadingSmartContractData,
  } = useSharedTemplatePageData();
  const { cloning, cloneToDao } = useCloneCfcTemplate();
  const { accountId } = useWalletContext();
  const [tooltip, setTooltip] = useState(defaultTooltipText);

  const availableDaos = useMemo(
    () => accountDaos?.filter(item => item.isCouncil),
    [accountDaos]
  );

  function renderContent() {
    if (loading) {
      return <Loader />;
    }

    if (!data) {
      return <NoResultsView title={t('noDataFound')} />;
    }

    const { createdBy, name, description, daos } = data;

    const url = CFC_LIBRARY_TEMPLATE_VIEW.replace('[template]', templateId);
    const shareUrl = `${document.location?.origin}${url}`;
    const shareContent = `CFC template: ${name} \n ${description || ''}`;

    return (
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.meta}>
            <div className={styles.title}>
              <TextTruncate
                line={2}
                element="span"
                truncateText="…"
                text={name}
                textTruncateChild={null}
              />
            </div>
            <div className={styles.creator}>
              <span>{t('actions.by')}</span>{' '}
              <span className={styles.creatorName}>
                <TextTruncate
                  line={2}
                  element="span"
                  truncateText="…"
                  text={createdBy}
                  textTruncateChild={null}
                />
              </span>
            </div>
          </div>
          <div className={styles.control}>
            <Tooltip overlay={<span>{tooltip}</span>} placement="top">
              <IconButton
                size="large"
                icon="buttonLink"
                iconProps={{
                  width: 18,
                }}
                className={styles.controlIconButton}
                onClick={async () => {
                  await copyToClipboard(shareUrl);

                  setTooltip(t('copiedSuccessfully'));

                  setTimeout(() => {
                    setTooltip(defaultTooltipText);
                  }, 2000);
                }}
              />
            </Tooltip>
            <a
              rel="noreferrer"
              target="_blank"
              href={`https://t.me/share/url?url=${encodeURIComponent(
                shareUrl
              )}&text=${shareContent}`}
            >
              <IconButton
                size="large"
                iconProps={{
                  width: 18,
                }}
                icon="socialTelegram"
                className={styles.controlIconButton}
              />
            </a>
            <a
              rel="noreferrer"
              target="_blank"
              className="twitter-share-button"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `${shareContent}\n${shareUrl}`
              )}`}
            >
              <IconButton
                size="large"
                iconProps={{
                  width: 18,
                }}
                icon="socialTwitter"
                className={styles.controlIconButton}
              />
            </a>

            <ApplyToDaos
              simpleView
              accountDaos={availableDaos}
              template={data}
              onSave={async values => {
                cloneToDao(
                  values.map(value => ({ templateId, targetDao: value.daoId }))
                );

                showNotification({
                  type: NOTIFICATION_TYPES.SUCCESS,
                  lifetime: 10000,
                  description: t('actions.templateSavedSuccessfully'),
                });
              }}
              disabled={!accountId || cloning}
              buttonProps={{
                variant: 'green',
              }}
              className={styles.duplicateControlBtn}
            >
              {cloning ? <LoadingIndicator /> : t('actions.useInDao')}
            </ApplyToDaos>
          </div>
        </div>

        <div className={styles.body}>
          <div className={cn(styles.list, styles.hideMobile)}>
            <OptionsList
              loading={loading}
              title={t('actions.usedInDaos')}
              data={daos}
              renderItem={item => (
                <li key={item.id} className={styles.listItemCond}>
                  <Link
                    passHref
                    href={{
                      pathname: SINGLE_DAO_PAGE,
                      query: { dao: item.id },
                    }}
                  >
                    <a className={styles.link}>{item.id}</a>
                  </Link>
                </li>
              )}
              suffix="DAOs"
            />

            <OptionsList
              className={styles.optionsList}
              loading={loadingSmartContractData}
              title="Available Smart Contract templates"
              data={templatesBySmartContract}
              renderItem={item => (
                <li key={item.id} className={styles.listItem}>
                  <Link
                    passHref
                    href={{
                      pathname: CFC_LIBRARY_TEMPLATE_VIEW,
                      query: { template: item.id },
                    }}
                  >
                    <a className={styles.link}>
                      {item.name}
                      <span className={styles.sub}>
                        {item.config.methodName}
                      </span>
                    </a>
                  </Link>
                </li>
              )}
              suffix="templates"
            />
          </div>
          <div className={styles.card}>
            <CustomFcTemplateCard
              config={data.config}
              className={styles.card}
              disabled
              editable={false}
              name={data.name}
              isEnabled={false}
              defaultExpanded
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.nav}>
        <BackButton
          name={t('actions.backToActionsLibrary')}
          href={{
            pathname: CFC_LIBRARY,
          }}
        />
      </div>
      {renderContent()}
    </div>
  );
};

SharedTemplatePage.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default SharedTemplatePage;
