import React from 'react';
import { Modal } from 'components/modal';
import RadioGroup, { Radio } from 'astro_2.0/components/inputs/Radio';
import { NotificationDisableOption } from 'types/notification';
import { NOTIFICATION_SETTINGS_DISABLE_OPTIONS } from 'mocks/notificationsData';
import styles from './NotificationsDisableModal.module.scss';

export interface NotificationsDisableModalProps<T> {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  text: string;
  value: T;
  // onChange: (value: T, e?: React.ChangeEvent<HTMLInputElement>) => void;
  options: NotificationDisableOption[];
}

export const NotificationsDisableModal = <T,>({
  isOpen,
  onClose,
  text,
  value,
  // onChange,
  options = NOTIFICATION_SETTINGS_DISABLE_OPTIONS,
}: NotificationsDisableModalProps<T>): JSX.Element => {
  /*
  const handleChange = useCallback(
    (newValue: string, e?: React.ChangeEvent<HTMLInputElement>) => {
      onChange((newValue as unknown) as T, e);
    },
    [onChange]
  );
*/

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className={styles.title}>Disable Notifications</div>
        <div className={styles.text}>{text}</div>
        <RadioGroup
          className={styles.radioGroup}
          itemClassName={styles.radio}
          activeItemClassName={styles.activeRadio}
          value={((value as unknown) as string) || ''}
          // onChange={handleChange}
          // eslint-disable-next-line no-console
          onChange={val => console.log(val)}
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
