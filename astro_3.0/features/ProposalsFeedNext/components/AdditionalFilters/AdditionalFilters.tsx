import React, { FC, useState } from 'react';
import clsx from 'classnames';

import { Icon } from 'components/Icon';

import { Button } from 'components/button/Button';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';
import { SearchInput } from 'astro_2.0/components/SearchInput';
import { useRouter } from 'next/router';

import { useAsyncFn } from 'react-use';
import { SputnikHttpService } from 'services/sputnik';
import { useWalletContext } from 'context/WalletContext';

import styles from './AdditionalFilters.module.scss';

interface Props {
  className?: string;
}

export const AdditionalFilters: FC<Props> = ({ className }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { accountId } = useWalletContext();

  const [{ loading: proposalsSearchLoading }, fetchSearchProposals] =
    useAsyncFn(
      async (value: string) => {
        return SputnikHttpService.getProposalsByProposer({
          daoId: (router.query.dao ?? '') as string,
          accountId,
          proposers: value,
        });
      },
      [router.query, accountId]
    );

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
          <SearchInput
            placeholder="Type proposer account"
            label="Filter by proposer"
            showResults
            onClose={() => {
              router.push({
                query: {
                  ...router.query,
                  proposer: '',
                },
              });
            }}
            defaultValue={(router.query.proposer ?? '') as string}
            loading={proposalsSearchLoading}
            renderResult={(item: string) => (
              <Button
                onClick={() => {
                  router.push({
                    query: {
                      ...router.query,
                      proposer: item,
                    },
                  });
                  setOpen(false);
                }}
                variant="transparent"
                key={item}
                className={styles.foundItem}
              >
                {item}
              </Button>
            )}
            onSubmit={fetchSearchProposals}
          />
        </div>
      </div>
    </GenericDropdown>
  );
};
