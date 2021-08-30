import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { Modal } from 'components/modal';
import { DaoOptionCard } from 'features/create-dao/components/option-card/DaoOptionCard';
import { DaoSettingOption } from 'features/create-dao/components/steps/types';
import React, { FC, useState } from 'react';

import styles from './dao-settings-modal.module.scss';

export interface DaoSettingsModalProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  initialValue?: string | undefined;
  options: DaoSettingOption<string>[];
  title: string;
  description: string;
  note: string;
}

export const DaoSettingsModal: FC<DaoSettingsModalProps> = ({
  isOpen,
  initialValue,
  onClose,
  options = [],
  title,
  description,
  note
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.root}>
        <div>
          <h2> {title} </h2>
          <p className={styles.note}>{note}</p>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.list}>
          {options.map(option => (
            <DaoOptionCard
              active={option.value === value}
              key={option.value}
              onClick={() => setValue(option.value)}
              iconNode={<Icon width={56} name={option.icon} />}
              title={option.title}
              subject={option.subject}
              description={option.description}
            />
          ))}
        </div>

        <Button onClick={() => onClose(value)}> SAVE SETTINGS </Button>
      </div>
    </Modal>
  );
};
