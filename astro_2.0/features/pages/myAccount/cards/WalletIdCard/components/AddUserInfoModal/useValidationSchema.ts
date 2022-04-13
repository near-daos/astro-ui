import * as yup from 'yup';
import { useMemo } from 'react';
import { AnyObjectSchema } from 'yup';
import { useTranslation } from 'next-i18next';

export function useValidationSchema(
  isEmail: boolean,
  tBase: string
): AnyObjectSchema {
  const { t } = useTranslation('common');

  const schema = useMemo(() => {
    const valBase = isEmail ? `${tBase}.email` : `${tBase}.phone`;

    const validation = isEmail
      ? yup
          .string()
          .required(t(`${valBase}.required`))
          .email(t(`${valBase}.error`))
      : yup
          .string()
          .required(t(`${valBase}.required`))
          .matches(/^(\+[0-9]*)$/, t(`${valBase}.error`));

    return yup.object().shape({
      contact: validation,
    });
  }, [t, tBase, isEmail]);

  return schema;
}
