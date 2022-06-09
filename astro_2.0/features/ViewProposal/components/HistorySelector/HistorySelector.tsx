import React, { FC, useCallback, useState } from 'react';
import { format, parseISO } from 'date-fns';

import { useModal } from 'components/modal';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';
import { CompareVersionsModal } from 'astro_2.0/features/ViewProposal/components/HistorySelector/components/CompareVersionsModal';

import { useDaoCustomTokens } from 'hooks/useCustomTokens';

import { ProposalFeedItem } from 'types/proposal';

import styles from './HistorySelector.module.scss';

interface Props {
  data: ProposalFeedItem[];
}

export const HistorySelector: FC<Props> = ({ data }) => {
  const { tokens } = useDaoCustomTokens();
  const currentVersion = data[data.length - 1];
  const [open, setOpen] = useState(false);

  const [showModal] = useModal(CompareVersionsModal);

  const handleCompare = useCallback(
    async prevVersionInd => {
      await showModal({ data, index: prevVersionInd, tokens });
    },
    [data, showModal, tokens]
  );

  return (
    <GenericDropdown
      isOpen={open}
      onOpenUpdate={setOpen}
      parent={
        <div className={styles.root}>
          {format(
            parseISO(currentVersion.updatedAt as string),
            'dd MMMM yyyy, hh:mm'
          )}
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
            {format(parseISO(item.updatedAt as string), 'dd MMMM yyyy, hh:mm')}
            <Icon name="buttonArrowRight" className={styles.icon} />
          </Button>
        ))}
      </div>
    </GenericDropdown>
  );
};
