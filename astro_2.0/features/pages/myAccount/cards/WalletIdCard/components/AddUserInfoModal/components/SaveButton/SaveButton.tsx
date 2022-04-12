import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';
import React, { VFC, useState, useCallback } from 'react';

import { Button } from 'components/button/Button';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';

import styles from './SaveButton.module.scss';

interface SaveButtonProps {
  tBase: string;
  onClick: (code: string) => Promise<void>;
}

export const SaveButton: VFC<SaveButtonProps> = props => {
  const { tBase, onClick } = props;

  const [pending, setPending] = useState(false);

  const { t } = useTranslation('common');
  const { watch } = useFormContext();

  const verificationCode = watch('verificationCode');

  const onSave = useCallback(async () => {
    setPending(true);
    await onClick(verificationCode);
    setPending(false);
  }, [onClick, verificationCode]);

  return (
    <Button
      capitalize
      size="block"
      onClick={onSave}
      className={styles.root}
      disabled={isEmpty(verificationCode)}
    >
      {pending ? (
        <LoadingIndicator className={styles.loader} />
      ) : (
        t(`${tBase}.save`)
      )}
    </Button>
  );
};
