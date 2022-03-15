import React from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';
import { ShowMoreLinks } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks/components/ShowMoreLinks';
import { DaoLink } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks/components/DaoLink';

import styles from './DaoLinks.module.scss';

interface DaoLinksProps {
  legal?: { legalLink?: string; legalStatus?: string };
  links: string[];
  linkClassName?: string;
}

export const DaoLinks: React.FC<DaoLinksProps> = ({
  legal,
  links,
  linkClassName,
}) => {
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
      {!!links?.length && (
        <ul className={styles.links}>
          {links
            .filter((link, index) => link && index < 3)
            .map(link => (
              <DaoLink
                link={link}
                key={link}
                className={cn(linkClassName)}
                linkClassName={styles.linkItem}
              />
            ))}
          {links.length > 3 && <ShowMoreLinks links={links} />}
        </ul>
      )}
    </>
  );
};
