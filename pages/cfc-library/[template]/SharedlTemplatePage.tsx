import React from 'react';
import { NextPage } from 'next';
import TextTruncate from 'react-text-truncate';
import dynamic from 'next/dynamic';

import { CFC_LIBRARY } from 'constants/routing';

import { BackButton } from 'astro_2.0/features/ViewProposal/components/BackButton';
import { Loader } from 'components/loader';
import { IconButton } from 'components/button/IconButton';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import { useSharedTemplatePageData } from 'astro_2.0/features/pages/cfcLibrary/hooks';

import { DuplicateSharedTemplate } from 'astro_2.0/features/pages/cfcLibrary/components/DuplicateSharedTemplate';

import { CustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { useAllCustomTokens } from 'hooks/useCustomTokens';

import styles from './SharedTemplatePage.module.scss';

const CustomFcTemplateCard = dynamic(
  import(
    'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard'
  ),
  {
    ssr: false,
  }
);

const SharedTemplatePage: NextPage = () => {
  const { data, loading } = useSharedTemplatePageData();

  const { tokens } = useAllCustomTokens();

  function renderContent() {
    if (loading) {
      return <Loader />;
    }

    if (!data) {
      return <NoResultsView title="No data found" />;
    }

    const { creator, name } = data;

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
                  text={creator}
                  textTruncateChild={null}
                />
              </span>
            </div>
          </div>
          <div className={styles.control}>
            <IconButton
              size="large"
              icon="buttonLink"
              iconProps={{
                width: 18,
              }}
              className={styles.controlIconButton}
            />
            <IconButton
              size="large"
              iconProps={{
                width: 18,
              }}
              icon="socialTelegram"
              className={styles.controlIconButton}
            />
            <IconButton
              size="large"
              iconProps={{
                width: 18,
              }}
              icon="socialTwitter"
              className={styles.controlIconButton}
            />
            <DuplicateSharedTemplate className={styles.duplicateControlBtn} />
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.list}>
            <div className={styles.listTitle}>Duplicated</div>
            <ul>
              {data.usedInDaos.map(item => (
                <li key={item} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
            {data.usedInDaosTotal > data.usedInDaos.length && (
              <div className={styles.listTotal}>
                + {data.usedInDaosTotal - data.usedInDaos.length} DAOs
              </div>
            )}
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
