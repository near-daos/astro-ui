import * as yup from 'yup';

export const schema = yup.object().shape({
  amount: yup.number().positive().integer().required(),
  details: yup.string().required(),
  slots: yup.number().positive().integer().required(),
  deadlineThreshold: yup.number().positive().integer().required()
});

export const deadlineUnitOptions = [
  {
    value: 'day',
    label: 'days'
  },
  {
    value: 'week',
    label: 'weeks'
  },
  {
    value: 'month',
    label: 'months'
  }
];

export const tokenOptions = [
  {
    value: 'NEAR',
    label: 'NEAR'
  }
];
