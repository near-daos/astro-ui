import React, { FC, useState } from 'react';
import cn from 'classnames';

import { Modal } from 'components/modal';
import { Button } from 'components/button/Button';
import { Input } from 'components/inputs/Input';

import {
  DEFAULT_PROPOSAL_GAS,
  MAX_GAS,
  MIN_GAS,
} from 'services/sputnik/constants';

import styles from './ConfirmActionModal.module.scss';

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: (val?: string) => void;
  title: string;
  message: string;
}

export const ConfirmActionModal: FC<ConfirmActionModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
}) => {
  const [gas, setGas] = useState(`${DEFAULT_PROPOSAL_GAS}`);

  function getInputWidth() {
    if (gas?.length > 6 && gas?.length <= 10) {
      return `${gas?.length}ch`;
    }

    if (gas?.length > 10) {
      return '10ch';
    }

    return '6ch';
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={styles.root}>
        <div className={styles.title}>{title}</div>
        <div className={styles.message}>{message}</div>

        <div className={styles.content}>
          <div>
            <div className={styles.inputLabel}>Tgas</div>
            <div className={styles.row}>
              <Input
                className={cn(styles.inputWrapper, styles.detailsInput)}
                inputStyles={{
                  width: getInputWidth(),
                }}
                onClick={e => e.stopPropagation()}
                onChange={e => setGas((e.target as HTMLInputElement).value)}
                type="number"
                value={gas}
                min={MIN_GAS}
                step={1}
                max={MAX_GAS}
                isBorderless
                size="block"
                placeholder={`${DEFAULT_PROPOSAL_GAS}`}
              />
            </div>
          </div>
          <Button
            capitalize
            onClick={() => onClose(gas)}
            className={styles.confirmButton}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};
