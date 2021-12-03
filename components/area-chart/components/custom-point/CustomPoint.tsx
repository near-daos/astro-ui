import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { VictoryLabelProps } from 'victory';

import {
  CHART_MAIN_COLOR,
  POINT_LINE_COLOR,
} from 'components/area-chart/chart-styles';

import ChartTooltip from 'components/area-chart/components/chart-tooltip';

interface CustomPointProps extends VictoryLabelProps {
  x?: number;
  y?: number;
}

const CustomPoint: FC<CustomPointProps> = ({ x, y = 0, datum }) => {
  const [referenceElement, setReferenceElement] = React.useState(null);
  const [popperElement, setPopperElement] = React.useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  return (
    <g>
      <line
        x1={x}
        x2={x}
        y1={10}
        y2={256}
        stroke={POINT_LINE_COLOR}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <line
        x1={36}
        x2={900}
        y1={y}
        y2={y}
        stroke={POINT_LINE_COLOR}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <circle
        cx={x}
        cy={y}
        r={8}
        stroke="none"
        fill={CHART_MAIN_COLOR}
        opacity={0.2}
      />
      <circle
        cx={x}
        cy={y}
        r={4}
        stroke="none"
        fill={CHART_MAIN_COLOR}
        ref={setReferenceElement as React.LegacyRef<SVGCircleElement>}
      />
      {datum &&
        ReactDOM.createPortal(
          <div
            ref={setPopperElement as React.LegacyRef<HTMLDivElement>}
            style={styles.popper}
            {...attributes.popper}
          >
            <ChartTooltip data={datum} />
          </div>,
          document.body
        )}
    </g>
  );
};

export default CustomPoint;
