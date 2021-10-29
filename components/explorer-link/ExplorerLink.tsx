import React, { MouseEvent } from 'react';
import { Icon } from 'components/Icon';
import cn from 'classnames';
import { ExplorerLinkType } from 'components/explorer-link/types';
import styles from './explorer-link.module.scss';

interface ExplorerLinkProps {
  linkData: string;
  linkType: ExplorerLinkType;
  isAbsolute?: boolean;
  className?: string;
}

export const ExplorerLink: React.VFC<ExplorerLinkProps> = ({
  linkData,
  linkType,
  isAbsolute,
  className,
}) => {
  function generateExplorerLink(type: ExplorerLinkType) {
    switch (type) {
      case 'transaction':
        return `transactions/${linkData}`;
      case 'member':
        return `accounts/${linkData}`;
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
        <div className={className}>
          <a
            href={explorerLink}
            onClick={stopPropagation}
            className={cn(styles.root, {
              [styles.absolute]: isAbsolute,
            })}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="buttonExternal" className={styles.icon} />
          </a>
        </div>
      )}
    </>
  );
};
