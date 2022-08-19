import React, { FC, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import TextTruncate from 'react-text-truncate';
import { useRouter } from 'next/router';
import cn from 'classnames';

import { SharedProposalTemplate } from 'types/proposalTemplate';

import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';

import { CFC_LIBRARY_TEMPLATE_VIEW } from 'constants/routing';

import { ApplyToDaos } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard/components/ApplyToDaos';
import { useCfcValues } from 'astro_2.0/features/pages/cfcLibrary/context';
import { useCloneCfcTemplate } from 'astro_2.0/features/pages/cfcLibrary/hooks';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import styles from './TemplatesListItem.module.scss';

interface Props {
  data: SharedProposalTemplate;
}

export const TemplatesListItem: FC<Props> = ({ data }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    id,
    name,
    description,
    daoCount,
    config: { smartContractAddress },
  } = data;

  const { cloning, cloneToDao } = useCloneCfcTemplate();

  const { accountDaos, accountId, onUpdate } = useCfcValues();

  const handleRowClick = useCallback(() => {
    router.push({
      pathname: CFC_LIBRARY_TEMPLATE_VIEW,
      query: {
        template: id,
      },
    });
  }, [id, router]);

  return (
    <div
      tabIndex={0}
      role="button"
      onKeyPress={handleRowClick}
      className={styles.root}
      onClick={handleRowClick}
    >
      <div className={styles.name}>
        <div className={styles.title}>{name}</div>
        <TextTruncate
          containerClassName={styles.desc}
          line={2}
          element="div"
          truncateText="…"
          text={description}
          textTruncateChild={null}
        />
      </div>
      <div className={cn(styles.creator, styles.hideMobile)}>
        <TextTruncate
          line={2}
          element="div"
          truncateText="…"
          text={smartContractAddress}
          textTruncateChild={null}
        />
      </div>
      <div className={cn(styles.duplicated, styles.hideMobile)}>{daoCount}</div>
      <div className={styles.control}>
        <ApplyToDaos
          simpleView
          accountDaos={accountDaos}
          template={data}
          onSave={async values => {
            const res = await cloneToDao(
              values.map(value => ({ templateId: id, targetDao: value.daoId }))
            );

            showNotification({
              type: NOTIFICATION_TYPES.SUCCESS,
              lifetime: 10000,
              description: 'Successfully saved proposal template',
            });

            const daosIds = (
              res.filter(item => item !== null) as {
                proposalTemplateId: string;
                daoId: string;
              }[]
            ).map(item => item.daoId);

            onUpdate(id, daosIds.length);
          }}
          disabled={!accountId || cloning}
          className={styles.duplicateControlBtn}
          buttonProps={{
            variant: 'green',
          }}
        >
          {cloning ? <LoadingIndicator /> : t('actions.useInDao')}
        </ApplyToDaos>
      </div>
    </div>
  );
};
