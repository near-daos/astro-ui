import React, { Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon } from 'components/Icon';
import styles from './breadcrumbs.module.scss';

export interface BreadCrumbsProps {
  locationPath?: string;
}

export const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ locationPath }) => {
  const router = useRouter();
  const actualPath = locationPath || router.asPath;
  const locationsList = actualPath.split('/').filter(item => item !== '');
  const breadCrumbsList = [];

  for (let i = 0; i < locationsList.length; i += 1) {
    const text = locationsList[i];
    const link = `/${locationsList.slice(0, i + 1).join('/')}`;

    breadCrumbsList.push({ text, link });
  }

  return (
    <div className={styles.breadcrumbs}>
      {breadCrumbsList.map((breadcrumb, index) => (
        <Fragment key={breadcrumb.text}>
          {index !== breadCrumbsList.length - 1 ? (
            <>
              <Link passHref href={breadcrumb.link}>
                <a href="*" className={styles.link}>
                  {breadcrumb.text}
                </a>
              </Link>
              <Icon
                className={styles.arrow}
                name="buttonArrowRight"
                width={15}
              />
            </>
          ) : (
            <span>{breadcrumb.text}</span>
          )}
        </Fragment>
      ))}
    </div>
  );
};
