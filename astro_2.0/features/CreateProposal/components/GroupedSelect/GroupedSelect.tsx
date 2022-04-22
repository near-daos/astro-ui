import React, { CSSProperties } from 'react';
import { useId } from '@reach/auto-id';
import { useMeasure, useMedia } from 'react-use';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';

import Downshift from 'downshift';
import { IconButton } from 'components/button/IconButton';

import styles from './GroupedSelect.module.scss';

export type Option = {
  label: string;
  value: string;
  group: string;
  disabled?: boolean;
};

interface GroupedSelectProps {
  options: {
    title: string;
    options: Option[];
    disabled: boolean;
  }[];
  onChange: (value: string | null) => void;
  id?: string;
  defaultValue: string;
  inputSize?: number;
  inputStyles?: CSSProperties;
  caption?: string;
}

export const GroupedSelect = React.forwardRef<
  HTMLInputElement,
  GroupedSelectProps
>(
  (
    { options, onChange, defaultValue, inputStyles = {}, caption, ...rest },
    externalRef
  ) => {
    const { t } = useTranslation();
    const id = useId(rest.id);
    const handleChange = (selectedItem: Option | null) => {
      onChange(selectedItem?.value ?? null);
    };
    const [measureRef, { width }] = useMeasure();
    const isMobileOrTablet = useMedia('(max-width: 767px)');

    const itemToString = (i: Option | null) => {
      return i ? i.label : '';
    };

    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <Downshift
        itemToString={itemToString}
        onChange={handleChange}
        initialSelectedItem={options
          .reduce((r, k) => {
            r.push(...k.options);

            return r;
          }, [] as Option[])
          .find(item => item.value === defaultValue)}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        items={options}
      >
        {({
          getLabelProps,
          getInputProps,
          getItemProps,
          getToggleButtonProps,
          isOpen,
          selectedItem,
        }) => (
          <div className={styles.root}>
            <label {...getLabelProps()} className={styles.label} htmlFor={id}>
              {caption ||
                `${t('proposalCard.proposalType')} ${selectedItem?.group}`}
            </label>
            <label
              {...getToggleButtonProps()}
              htmlFor={id}
              className={styles.selectedLabel}
            >
              <div
                ref={measureRef as React.LegacyRef<HTMLDivElement>}
                className={styles.measureNode}
                style={{
                  background: 'tomato',
                  position: 'absolute',
                  top: -30,
                  overflow: 'hidden',
                  height: 0,
                  width: 'fit-content',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  ...inputStyles,
                }}
              >
                {selectedItem?.label}
              </div>
              <input
                {...getInputProps({
                  id,
                  ref: externalRef,
                  readOnly: true,
                })}
                style={{
                  width: isMobileOrTablet ? '100%' : width + 8,
                  ...inputStyles,
                }}
                type="text"
              />
              <IconButton icon="buttonArrowDown" className={styles.icon} />
            </label>
            {!isOpen ? null : (
              <ul className={styles.menu}>
                {
                  options.reduce(
                    (result, section) => {
                      result.sections.push(
                        <section key={section.title}>
                          {section.title && (
                            <div className={styles.sectionTitle}>
                              {section.title}
                            </div>
                          )}
                          {section.options.map((option: Option) => {
                            // eslint-disable-next-line no-param-reassign,no-plusplus
                            const index = result.itemIndex++;

                            return (
                              <div
                                key={option.value}
                                className={cn(styles.item, {
                                  [styles.disabled]:
                                    section.disabled || option.disabled,
                                })}
                                {...getItemProps({
                                  item: option,
                                  index,
                                })}
                              >
                                {itemToString(option)}
                              </div>
                            );
                          })}
                        </section>
                      );

                      return result;
                    },
                    { sections: [] as JSX.Element[], itemIndex: 0 }
                  ).sections
                }
              </ul>
            )}
          </div>
        )}
      </Downshift>
    );
  }
);
