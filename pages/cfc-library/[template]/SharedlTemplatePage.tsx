import React, { useMemo, useState } from 'react';
import { NextPage } from 'next';
import TextTruncate from 'react-text-truncate';
import dynamic from 'next/dynamic';
import cn from 'classnames';

import { CFC_LIBRARY, CFC_LIBRARY_TEMPLATE_VIEW } from 'constants/routing';

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

import { CustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { useAllCustomTokens } from 'hooks/useCustomTokens';
import { useWalletContext } from 'context/WalletContext';

import { copyToClipboard } from 'utils/copyToClipboard';

import { DaoFeedItem } from 'types/dao';

import styles from './SharedTemplatePage.module.scss';

const CustomFcTemplateCard = dynamic(
  import(
    'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard'
  ),
  {
    ssr: false,
  }
);

const defaultTooltipText = 'Copy page URL';

interface Props {
  accountDaos: DaoFeedItem[];
}

const SharedTemplatePage: NextPage<Props> = ({ accountDaos }) => {
  const { data, loading, templateId } = useSharedTemplatePageData();
  const { cloning, cloneToDao } = useCloneCfcTemplate();
  const { accountId } = useWalletContext();
  const [tooltip, setTooltip] = useState(defaultTooltipText);

  const { tokens } = useAllCustomTokens();

  const availableDaos = useMemo(
    () => accountDaos?.filter(item => item.isCouncil),
    [accountDaos]
  );

  function renderContent() {
    if (loading) {
      return <Loader />;
    }

    if (!data) {
      return <NoResultsView title="No data found" />;
    }

    const { createdBy, name, description, daos } = data;

    const url = CFC_LIBRARY_TEMPLATE_VIEW.replace('[template]', templateId);
    const shareUrl = `${document.location?.origin}${url}`;
    const shareContent = `CFC template: ${name} \n ${description}`;

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
              <span>by</span>{' '}
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

                  setTooltip('Copied successfully');

                  setTimeout(() => {
                    setTooltip(defaultTooltipText);
                  }, 2000);
                }}
              />
            </Tooltip>
            <a
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
              className="twitter-share-button"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                shareContent
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
              accountDaos={availableDaos}
              template={data}
              onSave={async values => {
                cloneToDao(
                  values.map(value => ({ templateId, targetDao: value.daoId }))
                );
              }}
              disabled={!accountId || cloning}
              buttonProps={{
                variant: 'green',
              }}
              className={styles.duplicateControlBtn}
            >
              {cloning ? <LoadingIndicator /> : 'Duplicate'}
            </ApplyToDaos>
          </div>
        </div>

        <div className={styles.body}>
          <div className={cn(styles.list, styles.hideMobile)}>
            <div className={styles.listTitle}>Duplicated</div>
            <ul>
              {daos?.slice(0, 9).map(item => (
                <li key={item.id} className={styles.listItem}>
                  {item.id}
                </li>
              ))}
            </ul>
            <div className={styles.listTotal}>
              {(daos?.length ?? 0) > 9 ? (
                <span>+ {(daos?.length ?? 0) - 9} DAOs</span>
              ) : (
                <span>{daos?.length} DAOs</span>
              )}
            </div>
          </div>
          <div className={styles.card}>
            <CustomTokensContext.Provider value={{ tokens }}>
              <CustomFcTemplateCard
                config={data.config}
                className={styles.card}
                disabled
                editable={false}
                name={data.name}
                isEnabled={false}
                defaultExpanded
              />
            </CustomTokensContext.Provider>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.nav}>
        <BackButton
          name="Back to CFC Library"
          href={{
            pathname: CFC_LIBRARY,
          }}
        />
      </div>
      {renderContent()}
    </div>
  );
};

export default SharedTemplatePage;
