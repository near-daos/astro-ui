import React, { FC, useCallback, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { WalletType } from 'types/config';

import { useWalletContext } from 'context/WalletContext';
import { useTranslation } from 'next-i18next';

import { CREATE_DRAFT_PAGE_URL } from 'constants/routing';

import { Icon, IconName } from 'components/Icon';
import { Button } from 'components/button/Button';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';

import styles from './DaoAction.module.scss';

interface Props {
  onCreateProposalClick?: () => void;
  daoId: string;
}

export const DaoAction: FC<Props> = ({ onCreateProposalClick, daoId }) => {
  const router = useRouter();
  const flags = useFlags();
  const { t } = useTranslation();
  const { accountId, login } = useWalletContext();
  const [open, setOpen] = useState(false);

  const closeDropdown = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleCreateProposal = useCallback(() => {
    if (isEmpty(accountId)) {
      login(WalletType.NEAR);
    } else if (onCreateProposalClick) {
      onCreateProposalClick();
    }

    closeDropdown();
  }, [accountId, closeDropdown, login, onCreateProposalClick]);

  const handleCreateDraft = useCallback(() => {
    router.push({
      pathname: CREATE_DRAFT_PAGE_URL,
      query: {
        dao: daoId,
      },
    });

    closeDropdown();
  }, [closeDropdown, daoId, router]);

  function renderAction(
    icon: IconName,
    label: string,
    description: string,
    action: () => void
  ) {
    return (
      <Button
        size="block"
        onClick={action}
        className={styles.action}
        variant="tertiary"
      >
        <Icon name={icon} className={styles.actionIcon} />
        <div className={styles.separator} />
        <div className={styles.labelWrapper}>
          <div className={styles.label}>{label}</div>
          <div className={styles.desc}>{description}</div>
        </div>
        <Icon
          name="buttonArrowRight"
          className={cn(styles.actionIcon, styles.navIcon)}
        />
      </Button>
    );
  }

  if (!flags.draftProposals) {
    return (
      <Button
        data-testid="createProposal"
        size="block"
        onClick={handleCreateProposal}
        className={styles.addProposalButton}
        variant="tertiary"
      >
        <Icon width={32} name="buttonAdd" className={styles.createIcon} />
      </Button>
    );
  }

  return (
    <GenericDropdown
      isOpen={open}
      onOpenUpdate={setOpen}
      parent={
        <div className={styles.root}>
          <Button
            data-testid="createProposal"
            size="block"
            onClick={() => {
              setOpen(true);
            }}
            className={styles.addProposalButton}
            variant="tertiary"
          >
            <Icon width={32} name="buttonAdd" className={styles.createIcon} />
          </Button>
        </div>
      }
      options={{
        placement: 'bottom-end',
      }}
    >
      <div className={styles.menu}>
        {renderAction(
          'sheet',
          t('daoDetailsCreateButton.draft.label'),
          t('daoDetailsCreateButton.draft.description'),
          handleCreateDraft
        )}
        {renderAction(
          'buttonEdit',
          t('daoDetailsCreateButton.proposal.label'),
          t('daoDetailsCreateButton.proposal.description'),
          handleCreateProposal
        )}
      </div>
    </GenericDropdown>
  );
};
