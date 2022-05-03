import React, { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import { Badge } from 'components/Badge';
import { BadgeList } from 'components/BadgeList';
import { useMeasure } from 'react-use';

import styles from './GroupsRenderer.module.scss';

type Item = {
  label: string;
  component: JSX.Element;
};

interface GroupsRendererProps {
  selectedItems: Item[];
}

export const GroupsRenderer: FC<GroupsRendererProps> = ({ selectedItems }) => {
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [wrapperRef, { width }] = useMeasure();
  const [contentRef, { width: contentWidth }] = useMeasure();

  useEffect(() => {
    if (contentWidth > width && !showPlaceholder) {
      setShowPlaceholder(true);
    } else if (contentWidth <= width && showPlaceholder) {
      setShowPlaceholder(false);
    }
  }, [contentWidth, showPlaceholder, width]);

  return (
    <div
      ref={wrapperRef as React.LegacyRef<HTMLDivElement>}
      className={styles.root}
    >
      <div
        className={styles.selectedMeasure}
        ref={contentRef as React.LegacyRef<HTMLDivElement>}
      >
        {selectedItems.map(sel => {
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
      <BadgeList
        selectedItems={selectedItems}
        showPlaceholder={showPlaceholder}
      />
    </div>
  );
};

export default GroupsRenderer;
