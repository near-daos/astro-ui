import cn from 'classnames';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useRef, useState } from 'react';

import { PAGE_LAYOUT_ID } from 'constants/common';
import { CREATE_DAO_URL } from 'constants/routing';

import { Sidebar } from 'components/Sidebar';
import { AppHeader } from 'astro_2.0/components/AppHeader';
import { LinkToTop } from 'astro_2.0/components/LinkToTop';
import { NotificationContainer } from 'features/notifications';

import { getElementSize } from 'utils/getElementSize';
import { useWindowResize } from 'hooks/useWindowResize';

import styles from './PageLayout.module.scss';

export const PageLayout: FC = ({ children }) => {
  const router = useRouter();

  const sideBarRef = useRef(null);

  const [sideBarWidth, setSideBarWidth] = useState(0);

  const isCreateDaoPage = router.route.match(CREATE_DAO_URL);

  const rootClassName = cn(styles.root, {
    [styles.createDao]: isCreateDaoPage,
  });

  const calculateMaxWidth = useCallback(() => {
    const sideBarEl = sideBarRef.current;

    if (sideBarEl) {
      const { widthWithMargin } = getElementSize(sideBarEl);

      setSideBarWidth(widthWithMargin);
    }
  }, [sideBarRef]);

  useWindowResize(calculateMaxWidth);

  return (
    <div className={rootClassName}>
      <Sidebar ref={sideBarRef} />
      <div
        className={styles.content}
        style={{ maxWidth: `calc(100vw - ${sideBarWidth}px)` }}
      >
        <AppHeader />
        <div className={styles.main} id={PAGE_LAYOUT_ID}>
          {children}
        </div>
        <LinkToTop />
      </div>
      <NotificationContainer />
    </div>
  );
};
