import React, { useCallback, useRef, useState, VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';
import get from 'lodash/get';

import { updateAction } from 'astro_2.0/features/CreateDao/components/helpers';
import { Icon } from 'components/Icon';
import { DebouncedInput } from 'components/inputs/Input';
import { IconButton } from 'components/button/IconButton';
import { InputFormWrapper } from 'components/inputs/InputFormWrapper';
import { Button } from 'components/button/Button';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';

import { useWalletContext } from 'context/WalletContext';

import { useStateMachine } from 'little-state-machine';
import styles from './DaoMemberLine.module.scss';

interface DaoLinkLineProps {
  item: { name: string; role: string };
  index: number;
  onRemove: () => void;
  canBeRemoved?: boolean;
}

export const DaoMemberLine: VFC<DaoLinkLineProps> = ({
  index,
  onRemove,
  canBeRemoved = true,
}) => {
  const {
    register,
    watch,
    trigger,
    setValue: setFormValue,
    formState: { errors },
  } = useFormContext();
  const { accountId } = useWalletContext();
  const { state } = useStateMachine({ updateAction });

  const [openGroupDropdown, setOpenGroupDropdown] = useState(false);

  const closeDropdown = useCallback(() => {
    setOpenGroupDropdown(false);
  }, [setOpenGroupDropdown]);

  const errorEl = useRef<HTMLDivElement>(null);

  const currentValue = watch(`accounts.${index}`);
  const error = get(errors, `accounts.${index}`);

  return (
    <div className={styles.root}>
      <div className={styles.link}>
        <InputFormWrapper
          errors={errors}
          errorElRef={errorEl}
          className={styles.validationWrapper}
          component={
            <DebouncedInput
              readOnly={currentValue.name === accountId}
              tabIndex={currentValue.name === accountId ? -1 : 0}
              inputClassName={cn({
                [styles.error]: !!error?.name,
              })}
              className={cn({
                [styles.disabled]: currentValue.name === accountId,
              })}
              placeholder="NEAR name"
              {...register(`accounts.${index}.name`)}
              defaultValue={currentValue.name}
              onValueChange={val => {
                setFormValue(
                  `accounts.${index}`,
                  { ...currentValue, name: val },
                  {
                    shouldValidate: true,
                  }
                );

                trigger('groups');
              }}
              size="block"
            />
          }
        />

        <GenericDropdown
          isOpen={openGroupDropdown}
          onOpenUpdate={setOpenGroupDropdown}
          parent={
            <button
              type="button"
              className={cn(styles.dropdown, {
                [styles.error]: !!error?.role,
              })}
              onClick={() => setOpenGroupDropdown(true)}
            >
              <p>{currentValue.role || 'Select group'}</p>

              <Icon name="buttonArrowDown" />
            </button>
          }
        >
          <div className={styles.dropdownWrapper}>
            {state.groups.items
              .filter(item => item?.slug !== 'all')
              .map(group => (
                <Button
                  variant="transparent"
                  key={group.name}
                  className={styles.dropdownItem}
                  onClick={() => {
                    setFormValue(
                      `accounts.${index}`,
                      { ...currentValue, role: group.name },
                      {
                        shouldValidate: true,
                      }
                    );

                    trigger('groups');

                    closeDropdown();
                  }}
                >
                  {group.name}
                </Button>
              ))}
          </div>
        </GenericDropdown>

        {canBeRemoved && (
          <IconButton
            disabled={currentValue === accountId}
            className={styles.deleteBtn}
            icon="buttonDelete"
            onClick={onRemove}
            size="medium"
          />
        )}
      </div>

      <div ref={errorEl} className={styles.errorEl} />
    </div>
  );
};
