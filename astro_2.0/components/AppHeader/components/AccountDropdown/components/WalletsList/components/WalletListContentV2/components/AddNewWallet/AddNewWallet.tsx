import { VFC } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { useModal } from 'components/modal';
import { useWalletContext } from 'context/WalletContext';

import { Icon } from 'components/Icon';
import { WalletSelectionModal } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletSelectionModal';
import { ListItem } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletsList/components/WalletListContentV2/components/ListItem';

import styles from './AddNewWallet.module.scss';

export const AddNewWallet: VFC = () => {
  const router = useRouter();

  const { t } = useTranslation();

  const { login } = useWalletContext();

  const [showModal] = useModal(WalletSelectionModal, {
    signIn: async walletType => {
      await login(walletType);
      router.reload();
    },
  });

  return (
    <ListItem onClick={showModal} className={styles.root}>
      <Icon name="buttonAdd" className={styles.icon} />
      {t('header.addWallet')}
    </ListItem>
  );
};
