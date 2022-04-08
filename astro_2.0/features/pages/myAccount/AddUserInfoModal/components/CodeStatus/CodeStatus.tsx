import React, { VFC } from 'react';
import { useTranslation } from 'next-i18next';
import useCountDown from 'react-countdown-hook';

import { Icon } from 'components/Icon';

import styles from './CodeStatus.module.scss';

interface CodeStatusProps {
  valid?: boolean;
}

const ONE_MINUTE_IN_MS = 60000;

export const CodeStatus: VFC<CodeStatusProps> = props => {
  const { valid } = props;

  const { t } = useTranslation('common');
  const [timeLeft, { start }] = useCountDown(ONE_MINUTE_IN_MS);

  let elToRender = <Icon name="buttonCheck" className={styles.icon} />;

  if (!valid) {
    if (timeLeft > 0) {
      elToRender = (
        <div>
          {timeLeft / 1000} {t('myAccountPage.popup.seconds')}
        </div>
      );
    } else {
      elToRender = (
        <div
          tabIndex={0}
          role="button"
          className={styles.sendButton}
          onClick={() => start()}
          onKeyPress={() => start()}
        >
          {t('myAccountPage.popup.send')}
        </div>
      );
    }
  }

  return <div className={styles.root}>{elToRender}</div>;
};
