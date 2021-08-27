import React, { CSSProperties } from 'react';
import { FixedSizeList, ListOnScrollProps } from 'react-window';

export interface ScrollListProps {
  height: number;
  itemSize: number;
  itemCount: number;
  onScroll?: (props: ListOnScrollProps) => void;
  renderItem: ({
    index,
    style
  }: {
    index: number;
    style: CSSProperties;
  }) => JSX.Element;
}

const ScrollList = React.forwardRef<FixedSizeList, ScrollListProps>(
  ({ height, itemSize, itemCount, onScroll, renderItem }, ref) => {
    return (
      <FixedSizeList
        height={height}
        itemCount={itemCount}
        initialScrollOffset={100}
        itemSize={itemSize}
        ref={ref}
        width="100%"
        onScroll={onScroll}
      >
        {renderItem}
      </FixedSizeList>
    );
  }
);

export default ScrollList;
