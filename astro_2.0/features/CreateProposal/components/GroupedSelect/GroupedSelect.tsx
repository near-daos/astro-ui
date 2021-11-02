import React from 'react';
import { useId } from '@reach/auto-id';

import Downshift from 'downshift';
import { IconButton } from 'components/button/IconButton';

import styles from './GroupedSelect.module.scss';

export type Option = {
  label: string;
  value: string;
  group: string;
};

interface GroupedSelectProps {
  options: {
    title: string;
    options: Option[];
  }[];
  onChange: (value: string | null) => void;
  id?: string;
  defaultValue: string;
  inputSize: number;
}

export const GroupedSelect = React.forwardRef<
  HTMLInputElement,
  GroupedSelectProps
>(({ options, onChange, defaultValue, inputSize, ...rest }, externalRef) => {
  const id = useId(rest.id);
  const handleChange = (selectedItem: Option | null) => {
    onChange(selectedItem?.value ?? null);
  };

  function itemToString(i: Option | null) {
    return i ? i.label : '';
  }

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
            Proposal type: {selectedItem?.group}
          </label>
          <label
            {...getToggleButtonProps()}
            htmlFor={id}
            className={styles.selectedLabel}
          >
            <input
              {...getInputProps({
                id,
                ref: externalRef,
                readOnly: true,
              })}
              size={inputSize}
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
                        <div className={styles.sectionTitle}>
                          {section.title}
                        </div>
                        {section.options.map((option: Option) => {
                          // eslint-disable-next-line no-param-reassign,no-plusplus
                          const index = result.itemIndex++;

                          return (
                            <div
                              key={option.value}
                              className={styles.item}
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
});
