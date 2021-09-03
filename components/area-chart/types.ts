export type Domain = [number, number] | [Date, Date];

export type ChartDataElement = {
  x: Date;
  y: number;
};

export type DomainControl = {
  domain: {
    x?: Domain | undefined;
    y?: Domain | undefined;
  };
  toggleDomain: (range: string) => void;
  activeRange: string;
  verticalDomain: [number, number];
  onZoomDataChange: () => void;
  maxDomainValue: number;
};

export interface ChartCaptionInterface {
  label: string;
  value: string;
  currency: string;
}
