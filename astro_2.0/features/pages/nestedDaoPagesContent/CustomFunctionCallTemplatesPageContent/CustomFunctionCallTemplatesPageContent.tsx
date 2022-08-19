import React, { FC, useMemo } from 'react';
import { useRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

import { SideFilter } from 'astro_2.0/components/SideFilter';
import { Loader } from 'components/loader';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import { DaoContext } from 'types/context';
import { DaoFeedItem } from 'types/dao';

import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { useDaoCustomTokens } from 'context/DaoTokensContext';

import {
  useProposalTemplates,
  useSaveTemplates,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/hooks';

import { isActiveUserCouncil } from 'astro_2.0/features/DaoDashboardHeader/components/CloneDaoWarning/helpers';
import { useWalletContext } from 'context/WalletContext';

import styles from './CustomFunctionCallTemplatesPageContent.module.scss';

const CustomFcTemplateCard = dynamic(
  import(
    'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard'
  ),
  {
    ssr: false,
  }
);

interface Props {
  daoContext: DaoContext;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
  accountDaos: DaoFeedItem[];
}

export const CustomFunctionCallTemplatesPageContent: FC<Props> = ({
  daoContext,
  accountDaos,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { stateFilter } = router.query;
  const { tokens } = useDaoCustomTokens();
  const availableDaos = useMemo(
    () => accountDaos.filter(item => item.isCouncil),
    [accountDaos]
  );
  const { accountId } = useWalletContext();
  const canActOnFlow = isActiveUserCouncil(daoContext.dao, accountId);

  const { templates, loading, updateTemplate, deleteTemplate } =
    useProposalTemplates(daoContext.dao.id);

  const { saveTemplates } = useSaveTemplates();

  const filterOptions = useMemo(() => {
    const keys = ['Active', 'Inactive'];

    return keys.map(key => ({
      label: key,
      value: key,
    }));
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.titleRow}>DAO Settings</div>
      <div className={styles.sideFilter}>
        <SideFilter
          queryName="stateFilter"
          list={filterOptions}
          title={t('customFunctionCallTemplates')}
          className={styles.daoConfigFilter}
        />
      </div>
      <div className={styles.content}>
        {loading || isEmpty(tokens) ? (
          <Loader />
        ) : (
          <>
            {!templates.length && (
              <NoResultsView title="No templates saved yet" />
            )}
            {templates
              .filter(item => {
                if (stateFilter === 'Active') {
                  return item.isEnabled;
                }

                if (stateFilter === 'Inactive') {
                  return !item.isEnabled;
                }

                return true;
              })
              .map(item => (
                <CustomFcTemplateCard
                  key={`${item.id}_${item.updatedAt}`}
                  templateId={item.id}
                  daoId={daoContext.dao.id}
                  flagCover={daoContext.dao.flagCover}
                  template={item}
                  config={item.config}
                  accountDaos={availableDaos}
                  onUpdate={updateTemplate}
                  onDelete={deleteTemplate}
                  className={styles.card}
                  onSaveToDaos={saveTemplates}
                  disabled={!accountId}
                  editable={canActOnFlow}
                  name={item.name}
                  isEnabled={item.isEnabled}
                />
              ))}
          </>
        )}
      </div>
    </div>
  );
};
