import { Modal } from 'components/modal';
import React from 'react';
import { DaoLink } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks/components/DaoLink';
import styles from './MoreLinks.module.scss';

interface MoreLinksModal {
  links: string[];
  isOpen: boolean;
  onClose: (val?: string) => void;
}

export const MoreLinksModal: React.FC<MoreLinksModal> = ({
  links,
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={styles.root}>
        <div className={styles.title}>Links & Socials</div>
        <ul className={styles.links}>
          {links.map(link => (
            <DaoLink link={link} key={link} />
          ))}
        </ul>
      </div>
    </Modal>
  );
};
