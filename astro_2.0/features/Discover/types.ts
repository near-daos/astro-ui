import { ChartDataElement } from 'components/AreaChartRenderer/types';

export type TControlTab = {
  id: string;
  label: string;
  value: string;
  trend: number;
};

export type TopicValue = {
  count: number;
  growth: number;
};

export type LeaderboardData = {
  activity?: TopicValue;
  dao: string;
  overview: ChartDataElement[];
};
