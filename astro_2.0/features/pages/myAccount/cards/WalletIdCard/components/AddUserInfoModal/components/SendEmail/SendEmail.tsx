import React, { VFC } from 'react';
import { useTranslation } from 'next-i18next';

import styles from './SendEmail.module.scss';

interface CodeStatusProps {
  tBase: string;
  timeLeft: number;
}

export const SendEmail: VFC<CodeStatusProps> = props => {
  const { tBase, timeLeft } = props;

  const { t } = useTranslation('common');

  let elToRender = (
    <button type="submit" className={styles.sendButton}>
      {t(`${tBase}.send`)}
    </button>
  );

  if (timeLeft > 0) {
    elToRender = (
      <div>
        {timeLeft / 1000} {t(`${tBase}.seconds`)}
      </div>
    );
  }

  return <div className={styles.root}>{elToRender}</div>;
};
