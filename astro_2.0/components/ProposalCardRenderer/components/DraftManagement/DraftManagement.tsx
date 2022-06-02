import React, { FC } from 'react';

import { Button } from 'components/button/Button';

import styles from './DraftManagement.module.scss';

interface DraftManagementProps {
  onEditDraft: () => void;
  onConvertToProposal: () => void;
}

export const DraftManagement: FC<DraftManagementProps> = ({
  onEditDraft,
  onConvertToProposal,
}) => {
  return (
    <div>
      <Button
        capitalize
        variant="secondary"
        className={styles.button}
        onClick={onEditDraft}
      >
        Edit
      </Button>
      <Button
        capitalize
        className={styles.button}
        onClick={onConvertToProposal}
      >
        Convert to proposal
      </Button>
    </div>
  );
};
