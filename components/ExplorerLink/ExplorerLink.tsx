import React, { MouseEvent } from 'react';
import { Icon } from 'components/Icon';
import cn from 'classnames';
import { ExplorerLinkType } from 'components/ExplorerLink/types';
import { nearConfig } from 'config';
import styles from './ExplorerLink.module.scss';

interface ExplorerLinkProps {
  linkData: string;
  linkType: ExplorerLinkType;
  textLabel?: string;
  isAbsolute?: boolean;
  className?: string;
}

function generateExplorerLink(type: ExplorerLinkType, linkData: string) {
  switch (type) {
    case 'transaction':
      return `${nearConfig.explorerUrl}/transactions/${linkData}`;
    case 'member':
      return `${nearConfig.explorerUrl}/accounts/${linkData}`;
    default:
      return '';
  }
}

function stopPropagation(e: MouseEvent) {
  e.stopPropagation();
}

export const ExplorerLink: React.VFC<ExplorerLinkProps> = ({
  linkData,
  linkType,
  textLabel,
  isAbsolute,
  className,
}) => {
  const explorerLink = generateExplorerLink(linkType, linkData);

  return (
    <>
      {linkData && (
        <div className={className}>
          <a
            href={explorerLink}
            onClick={stopPropagation}
            className={cn(styles.root, {
              [styles.absolute]: isAbsolute,
              [styles.labeled]: textLabel,
            })}
            target="_blank"
            rel="noreferrer"
          >
            {textLabel && <span className={styles.label}>{textLabel}</span>}
            <span className={styles.iconWrapper}>
              <Icon name="buttonExternal" className={styles.icon} />
            </span>
          </a>
        </div>
      )}
    </>
  );
};
