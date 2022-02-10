import React, { FC, useState } from 'react';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';

import styles from './FiltersPanel.module.scss';

export const FiltersPanel: FC = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.root}>
      <GenericDropdown
        isOpen={open}
        onOpenUpdate={setOpen}
        parent={
          <div>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setOpen(true)}
            >
              <span className={styles.buttonContent}>
                <span>Filters</span>
                <Icon name="listFilter" className={styles.controlIcon} />
              </span>
            </Button>
          </div>
        }
        options={{
          placement: 'bottom-end',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 24],
              },
            },
          ],
        }}
      >
        <div className={styles.panel}>{children}</div>
      </GenericDropdown>
    </div>
  );
};
