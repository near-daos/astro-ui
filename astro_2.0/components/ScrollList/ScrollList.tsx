import React, { CSSProperties } from 'react';
import { VariableSizeList, ListOnScrollProps } from 'react-window';

export interface ScrollListProps {
  height: number;
  itemSize: (index: number) => number;
  itemCount: number;
  onScroll?: (props: ListOnScrollProps) => void;
  renderItem: ({
    index,
    style,
  }: {
    index: number;
    style: CSSProperties;
  }) => JSX.Element;
}

export const ScrollList = React.forwardRef<VariableSizeList, ScrollListProps>(
  ({ height, itemSize, itemCount, onScroll, renderItem }, ref) => {
    return (
      <VariableSizeList
        height={height}
        itemCount={itemCount}
        itemSize={itemSize}
        ref={ref}
        width="100%"
        onScroll={onScroll}
      >
        {renderItem}
      </VariableSizeList>
    );
  }
);
