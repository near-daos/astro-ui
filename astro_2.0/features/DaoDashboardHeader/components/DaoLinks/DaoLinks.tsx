import React from 'react';

import { Icon } from 'components/Icon';
import { ShowMoreLinks } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks/components/ShowMoreLinks';

import styles from './DaoLinks.module.scss';

interface DaoLinksProps {
  legal?: { legalLink?: string; legalStatus?: string };
  links: string[];
  linkClassName?: string;
}

export const DaoLinks: React.FC<DaoLinksProps> = ({ legal, links }) => {
  return (
    <>
      {legal?.legalLink && (
        <div>
          <a
            href={legal.legalLink}
            target="_blank"
            rel="noreferrer"
            className={styles.legalLink}
          >
            {legal.legalStatus || 'Public Limited Company'}
            <Icon
              name="buttonExternal"
              width={14}
              className={styles.legalIcon}
            />
          </a>
        </div>
      )}
      <ShowMoreLinks links={links} />
    </>
  );
};
