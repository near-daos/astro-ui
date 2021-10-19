import React, { MouseEvent } from 'react';
import { nearConfig } from 'config';
import { Icon } from 'components/Icon';
import cn from 'classnames';
import styles from './explorer-link.module.scss';

interface ExplorerLinkProps {
  transaction: string;
  isAbsolute?: boolean;
}

export const ExplorerLink: React.VFC<ExplorerLinkProps> = ({
  transaction,
  isAbsolute
}) => {
  const explorerLink = `${nearConfig.explorerUrl}/transactions/${transaction}`;

  function stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <>
      {transaction && (
        <a
          href={explorerLink}
          onClick={stopPropagation}
          className={cn(styles.root, { [styles.absolute]: isAbsolute })}
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="buttonExternal" className={styles.icon} />
        </a>
      )}
    </>
  );
};
