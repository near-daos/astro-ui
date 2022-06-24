import React, { CSSProperties, useCallback, useState } from 'react';
import { useId } from '@reach/auto-id';
import { useMeasure, useMedia } from 'react-use';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';

import Downshift from 'downshift';
import { IconButton } from 'components/button/IconButton';
import { SearchInput } from 'astro_2.0/components/SearchInput';

import styles from './GroupedSelect.module.scss';

export type Option = {
  label: string;
  value: string;
  group: string;
  disabled?: boolean;
  opt?: string;
};

interface Section {
  title: string;
  options: Option[];
  disabled: boolean;
}

interface GroupedSelectProps {
  options: Section[];
  onChange: (value: Option | null) => void;
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
    {
      options: initialOptions,
      onChange,
      defaultValue,
      inputStyles = {},
      caption,
      ...rest
    },
    externalRef
  ) => {
    const [options, setOptions] = useState(initialOptions);
    const { t } = useTranslation();
    const id = useId(rest.id);
    const handleChange = (selectedItem: Option | null) => {
      onChange(selectedItem);
    };
    const [measureRef, { width }] = useMeasure();
    const isMobileOrTablet = useMedia('(max-width: 767px)');

    const itemToString = (i: Option | null) => {
      return i ? i.label : '';
    };

    const handleFilter = useCallback(
      (val: string) => {
        const value = val.toLowerCase();

        if (value === '') {
          setOptions(initialOptions);

          return Promise.resolve(null);
        }

        const newOptions = initialOptions.reduce<Section[]>((res, item) => {
          const sectionOptions = item.options.filter(option =>
            option.label.toLowerCase().includes(value)
          );

          if (sectionOptions.length) {
            res.push({
              ...item,
              options: sectionOptions,
            });
          }

          return res;
        }, []);

        setOptions(newOptions);

        return Promise.resolve(null);
      },
      [initialOptions]
    );

    return (
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
                <section className={styles.controlItem}>
                  <SearchInput
                    onSubmit={handleFilter}
                    loading={false}
                    placeholder="Search proposal by name"
                    className={styles.searchFilter}
                    onClose={() => setOptions(initialOptions)}
                  />
                </section>
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
                                key={`${option.value}_${option.label}`}
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
