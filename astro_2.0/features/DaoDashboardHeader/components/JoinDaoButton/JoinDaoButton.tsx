import React, { FC } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';

import { ProposalVariant } from 'types/proposal';

import { useWalletContext } from 'context/WalletContext';

import styles from './JoinDaoButton.module.scss';

interface JoinDaoButtonProps {
  onClick: (
    variant: ProposalVariant,
    initialValues: Record<string, string>
  ) => void;
  className?: string;
}

export const JoinDaoButton: FC<JoinDaoButtonProps> = ({
  onClick,
  className,
}) => {
  const { t } = useTranslation();
  const { accountId } = useWalletContext();

  return (
    <Button
      onClick={() =>
        onClick(ProposalVariant.ProposeAddMember, {
          memberName: accountId,
          details: 'I would like to join your DAO',
        })
      }
      className={cn(styles.root, className)}
      variant="transparent"
      size="small"
    >
      <Icon name="buttonAddUser" className={styles.icon} />
      {t('joinDao')}
    </Button>
  );
};
