import React, { FC } from 'react';

import { Button } from 'components/button/Button';

import styles from './DraftManagement.module.scss';

interface DraftManagementProps {
  onEditDraft: () => void;
  convertTOProposal?: () => void;
}

export const DraftManagement: FC<DraftManagementProps> = ({
  onEditDraft,
  convertTOProposal,
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
        onClick={() => {
          if (convertTOProposal) {
            convertTOProposal();
          }
        }}
      >
        Convert to proposal
      </Button>
    </div>
  );
};
