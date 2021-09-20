import Decimal from 'decimal.js';
import { yoktoNear } from 'services/SputnikService';

export const formatYoktoValue = (value: string): string => {
  const amountYokto = new Decimal(value);

  return amountYokto.div(yoktoNear).toFixed(2);
};
