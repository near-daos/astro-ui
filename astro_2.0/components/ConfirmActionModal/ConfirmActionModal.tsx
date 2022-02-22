import React, { FC, useState } from 'react';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Modal } from 'components/modal';
import { Button } from 'components/button/Button';
import { Input } from 'components/inputs/Input';
import { Icon } from 'components/Icon';
import { Popup } from 'components/Popup';

import { gasValidation } from 'astro_2.0/features/CreateProposal/helpers';

import {
  DEFAULT_PROPOSAL_GAS,
  DEFAULT_VOTE_GAS,
  MAX_GAS,
  MIN_GAS,
} from 'services/sputnik/constants';

import styles from './ConfirmActionModal.module.scss';

export interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: (val?: string) => void;
  title: string;
  message: string;
}

const schema = yup.object().shape({
  gas: gasValidation,
});

export const ConfirmActionModal: FC<ConfirmActionModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const methods = useForm<{ gas: number }>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      gas: DEFAULT_VOTE_GAS,
    },
    resolver: yupResolver(schema),
  });

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const submitHandler = (data: { gas: number }) => {
    // console.log(onClose());
    return onClose(data.gas.toString());
  };

  const gas = watch('gas').toString();
  const error = errors.gas;

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

        <form
          noValidate
          className={styles.content}
          onSubmit={handleSubmit(submitHandler)}
        >
          <div>
            <div
              className={cn(styles.inputLabel, {
                [styles.labelError]: !!error,
              })}
            >
              Tgas
              {!!error && (
                <>
                  <div ref={setRef} className={styles.errorIcon}>
                    <Icon name="info" width={12} className={styles.icon} />
                  </div>
                  <Popup anchor={ref} offset={[0, 10]} placement="right">
                    <span className={styles.errorMessage}>{error.message}</span>
                  </Popup>
                </>
              )}
            </div>
            <div className={styles.row}>
              <Input
                className={cn(styles.inputWrapper, styles.detailsInput, {
                  [styles.error]: !!error,
                })}
                inputStyles={{
                  width: getInputWidth(),
                }}
                onClick={e => e.stopPropagation()}
                type="number"
                min={MIN_GAS}
                step={1}
                max={MAX_GAS}
                isBorderless
                size="block"
                placeholder={`${DEFAULT_PROPOSAL_GAS}`}
                data-testid="gas-input"
                {...register('gas')}
              />
            </div>
          </div>
          <Button
            capitalize
            type="submit"
            data-testid="close-button"
            className={styles.confirmButton}
          >
            Confirm
          </Button>
        </form>
      </div>
    </Modal>
  );
};
