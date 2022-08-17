import React, { FC, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { useAsyncFn } from 'react-use';
import { useWalletContext } from 'context/WalletContext';
import { SputnikHttpService } from 'services/sputnik';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { useModal } from 'components/modal';
import { SaveFcTemplateModal } from 'astro_2.0/features/ViewProposal/components/SaveFcTemplate/components/SaveFcTemplateModal';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';

import { ProposalFeedItem } from 'types/proposal';
import { useSaveTemplates } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/hooks';

import styles from './SaveFcTemplate.module.scss';

interface Props {
  proposal: ProposalFeedItem;
}

export const SaveFcTemplate: FC<Props> = ({ proposal }) => {
  const { t } = useTranslation();
  const { accountId, pkAndSignature } = useWalletContext();

  const [{ loading }, getDaosList] = useAsyncFn(async () => {
    return SputnikHttpService.getAccountDaos(accountId);
  }, [accountId]);

  const [showModal] = useModal(SaveFcTemplateModal);

  const { saveTemplates } = useSaveTemplates();

  const handleClick = useCallback(async () => {
    const accountDaos = await getDaosList();

    const availableDaos = accountDaos.filter(item => item.isCouncil);

    const res = await showModal({ accountDaos: availableDaos, proposal });

    if (res && res[0] && pkAndSignature) {
      const data = res[0];

      await saveTemplates(data);
    }
  }, [getDaosList, pkAndSignature, proposal, saveTemplates, showModal]);

  return (
    <div className={styles.root}>
      <Button
        size="small"
        variant="tertiary"
        capitalize
        className={styles.control}
        onClick={handleClick}
      >
        <span className={styles.label}>{t('actions.saveTemplate')}</span>
        {loading ? (
          <LoadingIndicator className={styles.loading} />
        ) : (
          <Icon name="bookmark" className={styles.icon} />
        )}
      </Button>
    </div>
  );
};
