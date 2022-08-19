import React, { useCallback, useState } from 'react';

import { Modal } from 'components/modal';
import { Button } from 'components/button/Button';
import { Radio } from 'astro_2.0/components/inputs/radio/Radio';
import { RadioGroup } from 'astro_2.0/components/inputs/radio/RadioGroup';

import styles from './ConfirmCommentActionModal.module.scss';

export interface ConfirmCommentActionModalProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  text: string;
  title: string;
  options: { value: string; label: string }[];
}

export const ConfirmCommentActionModal = ({
  isOpen,
  onClose,
  text,
  title,
  options,
}: ConfirmCommentActionModalProps): JSX.Element => {
  const [value, setValue] = useState('');
  const handleChange = useCallback((val: string) => {
    setValue(val);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.text}>{text}</div>
        <RadioGroup
          className={styles.radioGroup}
          itemClassName={styles.radio}
          activeItemClassName={styles.activeRadio}
          value={(value as unknown as string) || ''}
          onChange={handleChange}
        >
          {options.map((option: { value: string; label: string }) => (
            <Radio
              key={option.value}
              value={option.value}
              label={option.label}
            />
          ))}
        </RadioGroup>
        <div className={styles.controls}>
          <Button
            size="small"
            variant="secondary"
            className={styles.btn}
            onClick={() => onClose()}
          >
            Cancel
          </Button>
          <Button
            disabled={!value}
            size="medium"
            variant="primary"
            className={styles.btn}
            onClick={() => onClose(value)}
          >
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
};
