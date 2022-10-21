import React, { FC, useState } from 'react';
import clsx from 'classnames';
import { useRouter } from 'next/router';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';
import { Checkbox } from 'components/inputs/Checkbox';
import { Tooltip } from 'astro_2.0/components/Tooltip';

import styles from './AdditionalDaosFilters.module.scss';

interface Props {
  className?: string;
}

export const AdditionalDaosFilters: FC<Props> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const daosView = (router.query.daosView as string) ?? 'active';

  const onDaosViewChange = async (value: string) => {
    const nextQuery = {
      ...router.query,
      daosView: value,
    };

    await router.replace(
      {
        query: nextQuery,
      },
      undefined,
      { shallow: true, scroll: false }
    );
  };

  return (
    <GenericDropdown
      isOpen={open}
      placement="bottom-start"
      arrow
      arrowClassName={styles.arrow}
      onOpenUpdate={setOpen}
      parent={
        <div className={clsx(styles.root, className)}>
          <Button variant="transparent" className={styles.control} size="block">
            <Icon name="listFilter" className={styles.controlIcon} />
          </Button>
        </div>
      }
    >
      <div className={styles.menu}>
        <div className={styles.menuRow}>
          <Checkbox
            onClick={() =>
              onDaosViewChange(daosView === 'active' ? 'all' : 'active')
            }
            label="Show active DAOs only"
            className={styles.checkbox}
            checked={daosView === 'active'}
          />
          <Tooltip
            placement="top"
            className={styles.iconWrapper}
            popupClassName={styles.popupWrapper}
            overlay={
              <div className={styles.tooltip}>
                What are the rules for an &lsquo;active DAO&rsquo;?
                <br />
                <ul>
                  <li>More than one member</li>
                  <li>More than one proposal in the last month</li>
                  <li>
                    More than one transfer into the DAO wallet (FT or NFT) in
                    the last month
                  </li>
                </ul>
              </div>
            }
          >
            <Icon name="info" className={styles.icon} />
          </Tooltip>
        </div>
      </div>
    </GenericDropdown>
  );
};
