import React, { FC, ReactNode } from 'react';

import { Modal } from 'components/modal';
import { IconButton } from 'components/button/IconButton';

import styles from './dao-details-popup.module.scss';

type ExternalLink = {
  type: 'Twitter' | 'Discord' | 'AnyUrl';
  url: string;
};

export interface DaoDetailsPopupProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  title: string;
  subtitle: string;
  children: ReactNode;
  createdAt: string;
  links: ExternalLink[];
}

export const DaoDetailsPopup: FC<DaoDetailsPopupProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  createdAt,
  links,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.root}>
        <h1>{title}</h1>
        <div className={styles.subtitle}>{subtitle}</div>
        <div className={styles.content}>{children}</div>
        <div className={styles.created}>Created {createdAt}</div>
        <ul className={styles.links}>
          {links.map(link => (
            <li className={styles.link} key={link.type}>
              <a href={link.url} target="_blank" rel="noreferrer">
                <IconButton icon={`social${link.type}`} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};
