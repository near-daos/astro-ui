export const CHART_MAIN_COLOR = '#381e80';
export const POINT_LINE_COLOR = '#BFBFBF';
const AXIS_COLOR = '#F7F5FC';
const TICK_COLOR = '#7c7c7d';
const STROKE_COLOR = '#6038D0';
const FONT_FAMILY = 'Inter';

export const LEFT_AXIS_STYLES = {
  axis: { stroke: AXIS_COLOR },
  axisLabel: { fontSize: 10, padding: 30 },
  ticks: { stroke: 'grey', size: 5 },
  tickLabels: {
    fontSize: 10,
    padding: 5,
    fill: TICK_COLOR,
    fontFamily: FONT_FAMILY,
  },
};

export const BOTTOM_AXIS_STYLES = {
  axis: { stroke: AXIS_COLOR },
  axisLabel: { fontSize: 20, padding: 30 },
  ticks: { stroke: 'grey', size: 5 },
  tickLabels: {
    fontSize: 12,
    padding: 5,
    fill: TICK_COLOR,
    fontFamily: FONT_FAMILY,
  },
};

export const LINE_STYLES = {
  data: {
    fill: 'url(#gradient)',
    stroke: STROKE_COLOR,
    strokeWidth: '2px',
  },
};
