import React from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import styles from './Checkbox.module.scss';

const Checkbox = React.forwardRef<HTMLLabelElement, Props>(
  ({ input, inputRef, classes, as, checkedIcon, label }, ref) => {
    const inputId = input.id || input.name;
    const isSwitch = as === 'switch';

    return (
      <label
        ref={ref}
        htmlFor={inputId}
        className={classNames(
          styles.root,
          { [styles.disabled]: input.disabled },
          classes?.root
        )}
      >
        <span
          className={classNames(
            styles.inputWrapper,
            {
              [classNames(
                styles.inputWrapperChecked,
                classes?.inputWrapperChecked
              )]: input.checked && !isSwitch,
              [styles.switchInputWrapper]: isSwitch,
            },
            classes?.inputWrapper
          )}
        >
          <input
            id={inputId}
            type="checkbox"
            ref={inputRef}
            {...input}
            className={classNames(styles.input, input.className)}
          />

          {!isSwitch &&
            checkedIcon &&
            React.cloneElement(checkedIcon, {
              className: classNames(
                checkedIcon?.props?.className,
                styles.checkedIcon,
                { [styles.checkedIconVisible]: input.checked },
                classes?.checkedIcon
              ),
              focusable: 'false',
              'aria-hidden': 'true',
            })}

          {isSwitch && (
            <>
              <span
                className={classNames(styles.switchTrack, {
                  [styles.switchTrackChecked]: input.checked,
                })}
              />
              <span
                className={classNames(styles.switchThumb, {
                  [styles.switchThumbChecked]: input.checked,
                })}
              />
            </>
          )}
        </span>

        {label && (
          <span
            className={classNames(
              styles.label,
              { [styles.switchLabel]: isSwitch },
              classes?.label
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

type Props = {
  input: React.InputHTMLAttributes<HTMLInputElement> & {
    name: string;
  };
  checkedIcon?: React.ReactElement;
  as?: 'Checkbox' | 'switch';
  classes?: Partial<
    Record<
      'root' | 'label' | 'inputWrapper' | 'inputWrapperChecked' | 'checkedIcon',
      string
    >
  >;
  inputRef?: React.MutableRefObject<HTMLInputElement>;
  label?: React.ReactNode;
};

Checkbox.defaultProps = {
  checkedIcon: <Icon name="check" className={styles.defaultIcon} />,
  as: 'Checkbox',
};

export default Checkbox;
