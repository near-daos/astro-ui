export type ChartDataElement = {
  x: Date;
  y: number;
  y2?: number;
};

export type Range =
  | 'DAY'
  | 'WEEK'
  | 'MONTH'
  | 'THREE_MONTHS'
  | 'SIX_MONTHS'
  | 'YEAR'
  | 'ALL';

export type LineDataPoint = {
  x: Date;
  y: number;
  y2?: number;
};

export type DomainControl = {
  data: LineDataPoint[];
  toggleDomain: (range: Range) => void;
  activeRange: Range;
};

export interface ChartCaptionInterface {
  label: string;
  value: string;
  currency: string;
}

export type Payload = {
  dataKey: string;
  color: string;
  value: number;
};
