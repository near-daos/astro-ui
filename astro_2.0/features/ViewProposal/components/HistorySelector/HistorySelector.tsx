import React, { FC, useCallback, useState } from 'react';

import { useModal } from 'components/modal';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';
import { CompareVersionsModal } from 'astro_2.0/features/ViewProposal/components/HistorySelector/components/CompareVersionsModal';

import { ProposalFeedItem } from 'types/proposal';

import { formatISODate } from 'utils/format';

import styles from './HistorySelector.module.scss';

interface Props {
  data: ProposalFeedItem[];
}

export const HistorySelector: FC<Props> = ({ data }) => {
  const currentVersion = data[data.length - 1];
  const [open, setOpen] = useState(false);

  const [showModal] = useModal(CompareVersionsModal);

  const handleCompare = useCallback(
    async prevVersionInd => {
      await showModal({ data, index: prevVersionInd });
    },
    [data, showModal]
  );

  return (
    <GenericDropdown
      isOpen={open}
      onOpenUpdate={setOpen}
      placement="bottom-end"
      parent={
        <div className={styles.root}>
          {formatISODate(currentVersion.updatedAt, 'dd MMMM yyyy, hh:mm')}
        </div>
      }
    >
      <div className={styles.menu}>
        <div className={styles.menuLegend}>
          Edited {data.length} time{data.length > 1 ? 's' : ''}
        </div>
        {data.map((item, i) => (
          <Button
            capitalize
            variant="tertiary"
            size="small"
            key={item.updatedAt}
            disabled={i === data.length - 1}
            className={styles.option}
            onClick={() => {
              handleCompare(i);
              setOpen(false);
            }}
          >
            {formatISODate(item.updatedAt, 'dd MMMM yyyy, hh:mm')}
            <Icon name="buttonArrowRight" className={styles.icon} />
          </Button>
        ))}
      </div>
    </GenericDropdown>
  );
};
