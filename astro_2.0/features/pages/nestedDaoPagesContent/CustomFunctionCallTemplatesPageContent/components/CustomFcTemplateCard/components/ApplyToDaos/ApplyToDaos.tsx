import React, { FC, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';

import { Button } from 'components/button/Button';
import { useModal } from 'components/modal';
import { SaveFcTemplateModal } from 'astro_2.0/features/ViewProposal/components/SaveFcTemplate/components/SaveFcTemplateModal';

import { DaoFeedItem } from 'types/dao';
import {
  ProposalTemplate,
  TemplateUpdatePayload,
} from 'types/proposalTemplate';

import { useWalletContext } from 'context/WalletContext';

import styles from './ApplyToDaos.module.scss';

interface Props {
  accountDaos?: DaoFeedItem[];
  template?: Partial<ProposalTemplate>;
  className?: string;
  onSave?: (data: TemplateUpdatePayload[]) => Promise<void>;
  disabled: boolean;
  buttonProps?: React.ComponentProps<typeof Button>;
  simpleView?: boolean;
}

export const ApplyToDaos: FC<Props> = ({
  accountDaos,
  template,
  onSave,
  className,
  disabled,
  children,
  buttonProps = {},
  simpleView,
}) => {
  const { t } = useTranslation();
  const { pkAndSignature } = useWalletContext();
  const [showModal] = useModal(SaveFcTemplateModal);

  const handleClick = useCallback(
    async e => {
      e.stopPropagation();

      if (!accountDaos || !template) {
        return;
      }

      const availableDaos = accountDaos.filter(item => item.isCouncil);

      const res = await showModal({
        accountDaos: availableDaos,
        template,
        name: template.name,
        simpleView,
      });

      if (res && res[0] && pkAndSignature && onSave) {
        const data = res[0];

        await onSave(data);
      }
    },
    [accountDaos, onSave, pkAndSignature, showModal, simpleView, template]
  );

  return (
    <Button
      size="small"
      variant="primary"
      noTextTransform
      className={cn(styles.control, className)}
      onClick={handleClick}
      disabled={disabled}
      {...buttonProps}
    >
      <span className={cn(styles.label, styles.row)}>
        {children || t('actions.copyToDao')}
      </span>
    </Button>
  );
};
