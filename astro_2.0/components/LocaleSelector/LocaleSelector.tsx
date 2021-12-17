import React, { FC, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { CircleFlag } from 'react-circle-flags';

import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';
import { Locales } from 'astro_2.0/components/LocaleSelector/components/Locales';

import styles from './LocaleSelector.module.scss';

export const LocaleSelector: FC = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const locale = router.locale ?? 'en';

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div className={styles.root} onClick={e => e.stopPropagation()}>
      <GenericDropdown
        arrow
        arrowClassName={styles.arrow}
        isOpen={open}
        onOpenUpdate={setOpen}
        options={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 24],
              },
            },
          ],
        }}
        parent={
          <div>
            <div className={cn(styles.selector)} ref={rootRef}>
              <CircleFlag
                countryCode={locale === 'en' ? 'us' : locale}
                className={styles.flag}
              />{' '}
              {locale}
            </div>
          </div>
        }
      >
        <Locales />
      </GenericDropdown>
    </div>
  );
};
