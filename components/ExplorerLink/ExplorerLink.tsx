import React, { MouseEvent } from 'react';
import { Icon } from 'components/Icon';
import cn from 'classnames';
import { ExplorerLinkType } from 'components/ExplorerLink/types';
import { configService } from 'services/ConfigService';
import styles from './ExplorerLink.module.scss';

interface ExplorerLinkProps {
  linkData: string;
  linkType: ExplorerLinkType;
  textLabel?: string;
  isAbsolute?: boolean;
  className?: string;
}

function generateExplorerLink(type: ExplorerLinkType, linkData: string) {
  const { nearConfig } = configService.get();

  switch (type) {
    case 'transaction':
      return `${nearConfig?.explorerUrl}/transactions/${linkData}`;
    case 'member':
      return `${nearConfig?.explorerUrl}/accounts/${linkData}`;
    default:
      return '';
  }
}

function handleClick(e: MouseEvent, link: string) {
  e.stopPropagation();
  e.preventDefault();
  window.open(link, '_blank');
}

function handleKeyPress(link: string) {
  window.open(link, '_blank');
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
          <div
            tabIndex={0}
            role="button"
            onKeyPress={() => handleKeyPress(explorerLink)}
            onClick={e => handleClick(e, explorerLink)}
            className={cn(styles.root, {
              [styles.absolute]: isAbsolute,
              [styles.labeled]: textLabel,
            })}
          >
            {textLabel && <span className={styles.label}>{textLabel}</span>}
            <span className={styles.iconWrapper}>
              <Icon name="buttonExternal" className={styles.icon} />
            </span>
          </div>
        </div>
      )}
    </>
  );
};
