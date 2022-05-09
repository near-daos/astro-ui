import React, { FC } from 'react';
import cn from 'classnames';
import { Badge } from 'components/Badge';
import styles from './BadgeList.module.scss';

type Item = {
  label: string;
  component: JSX.Element;
};

interface BadgeListProps<T> {
  selectedItems: Item[];
  showPlaceholder: boolean;
  selectedItemRenderer?: (item: T) => React.ReactNode;
}

export const BadgeList: FC<BadgeListProps<Item>> = ({
  selectedItems,
  showPlaceholder,
  selectedItemRenderer,
}) => {
  return (
    <div className={styles.selected}>
      {selectedItems
        .filter((k, i) => {
          if (i === 0) {
            return true;
          }

          return !showPlaceholder;
        })
        .map(sel => {
          if (selectedItemRenderer) {
            return selectedItemRenderer(sel);
          }

          return (
            <div key={sel.label} className={styles.selectedWrapper}>
              {sel.component}
            </div>
          );
        })}
      <div
        className={cn(styles.collapsedLabel, styles.selectedWrapper, {
          [styles.visible]: showPlaceholder,
        })}
      >
        <Badge size="small" variant="turqoise">
          +{selectedItems.length - 1}
        </Badge>
      </div>
    </div>
  );
};
