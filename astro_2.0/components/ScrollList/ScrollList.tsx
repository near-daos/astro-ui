import React, { CSSProperties, ComponentType } from 'react';
import {
  VariableSizeList as VariableSizeListComp,
  ListOnScrollProps,
} from 'react-window';

const VariableSizeList = VariableSizeListComp as ComponentType<
  VariableSizeListComp['props']
>;

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

export const ScrollList = React.forwardRef<
  typeof VariableSizeList,
  ScrollListProps
>(({ height, itemSize, itemCount, onScroll, renderItem }, ref) => {
  return (
    <VariableSizeList
      height={height}
      itemCount={itemCount}
      itemSize={itemSize}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref={ref}
      width="100%"
      onScroll={onScroll}
    >
      {renderItem}
    </VariableSizeList>
  );
});
