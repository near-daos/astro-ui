import React, { FC, useState } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { VictoryLabelProps } from 'victory';

import {
  CHART_MAIN_COLOR,
  POINT_LINE_COLOR
} from 'components/line-chart/chart-styles';

import ChartTooltip from 'components/line-chart/components/chart-tooltip';

interface CustomPointProps extends VictoryLabelProps {
  x?: number;
  y?: number;
}

const CustomPoint: FC<CustomPointProps> = ({ x, y = 0, datum }) => {
  const [referenceElement, setReferenceElement] = React.useState(null);
  const [popperElement, setPopperElement] = React.useState(null);
  const [show, setShow] = useState(false);
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  return (
    <g
      onMouseEnter={() => {
        if (!show) {
          setShow(true);
        }
      }}
      onMouseLeave={() => setShow(false)}
    >
      <line
        x1={x}
        x2={x}
        y1={40}
        y2={234}
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
      {show &&
        datum &&
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
