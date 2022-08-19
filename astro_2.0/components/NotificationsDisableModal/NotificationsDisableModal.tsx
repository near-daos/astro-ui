import React, { useCallback } from 'react';

import { NOTIFICATION_SETTINGS_DISABLE_OPTIONS } from 'mocks/notificationsData';

import { Modal } from 'components/modal';
import { NotificationDisableOption } from 'types/notification';
import { Radio } from 'astro_2.0/components/inputs/radio/Radio';
import { RadioGroup } from 'astro_2.0/components/inputs/radio/RadioGroup';

import { mapDelayToTime } from 'astro_2.0/features/Notifications';

import styles from './NotificationsDisableModal.module.scss';

export interface NotificationsDisableModalProps<T> {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  text: string;
  value: T;
  options: NotificationDisableOption[];
}

export const NotificationsDisableModal = <T,>({
  isOpen,
  onClose,
  text,
  value,
  options = NOTIFICATION_SETTINGS_DISABLE_OPTIONS,
}: NotificationsDisableModalProps<T>): JSX.Element => {
  const handleChange = useCallback(
    (newValue: string) => {
      const time = mapDelayToTime(newValue);

      onClose(time);
    },
    [onClose]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className={styles.title}>Disable Notifications</div>
        <div className={styles.text}>{text}</div>
        <RadioGroup
          className={styles.radioGroup}
          itemClassName={styles.radio}
          activeItemClassName={styles.activeRadio}
          value={(value as unknown as string) || ''}
          onChange={handleChange}
        >
          {options.map(option => (
            <Radio
              key={option.value}
              value={option.value}
              label={option.label}
              type="notifications"
            />
          ))}
        </RadioGroup>
      </div>
    </Modal>
  );
};
