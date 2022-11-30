import React, { useCallback } from 'react';
import { useWalletContext } from 'context/WalletContext';
import { Button } from 'components/button/Button';

import styles from './LoginButton.module.scss';

export const LoginButton: React.FC = () => {
  const { login } = useWalletContext();

  const handleLogin = useCallback(async () => {
    await login();
  }, [login]);

  return (
    <Button
      variant="green"
      size="small"
      capitalize
      onClick={handleLogin}
      className={styles.loginButton}
    >
      Connect wallet
    </Button>
  );
};
