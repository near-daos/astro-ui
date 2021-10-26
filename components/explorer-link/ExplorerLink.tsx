import React, { MouseEvent } from 'react';
import { nearConfig } from 'config';
import { Icon } from 'components/Icon';
import cn from 'classnames';
import { ExplorerLinkType } from 'components/explorer-link/types';
import styles from './explorer-link.module.scss';

interface ExplorerLinkProps {
  linkData: string;
  linkType: ExplorerLinkType;
  isAbsolute?: boolean;
}

export const ExplorerLink: React.VFC<ExplorerLinkProps> = ({
  linkData,
  linkType,
  isAbsolute
}) => {
  function generateExplorerLink(type: ExplorerLinkType) {
    switch (type) {
      case 'transaction':
        return `${nearConfig.explorerUrl}/transactions/${linkData}`;
      case 'member':
        return `${nearConfig.explorerUrl}/accounts/${linkData}`;
      default:
        return '';
    }
  }

  const explorerLink = generateExplorerLink(linkType);

  function stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <>
      {linkData && (
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
