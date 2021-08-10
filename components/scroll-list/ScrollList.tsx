import React, { CSSProperties } from 'react';
import { FixedSizeList } from 'react-window';

export interface ScrollListProps {
  height: number;
  itemSize: number;
  itemCount: number;
  renderItem: ({
    index,
    style
  }: {
    index: number;
    style: CSSProperties;
  }) => JSX.Element;
}

const ScrollList: React.FC<ScrollListProps> = ({
  height,
  itemSize,
  itemCount,
  renderItem
}) => {
  return (
    <FixedSizeList
      height={height}
      itemCount={itemCount}
      itemSize={itemSize}
      width="100%"
    >
      {renderItem}
    </FixedSizeList>
  );
};

export default ScrollList;
