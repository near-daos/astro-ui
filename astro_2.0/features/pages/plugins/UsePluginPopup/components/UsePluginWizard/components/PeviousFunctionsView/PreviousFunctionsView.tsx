import * as yup from 'yup';
import React, { FC } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';

import { useWizardContext } from 'astro_2.0/features/pages/plugins/UsePluginPopup/components/UsePluginWizard/helpers';
import { NearFunction } from 'astro_2.0/features/pages/plugins/UsePluginPopup/types';
import { Select } from 'components/inputs/selects/Select';
import { Button } from 'components/button/Button';

import styles from './PeviousFunctionsView.module.scss';

interface IForm {
  functionName: string;
}

const schema = yup.object().shape({
  functionName: yup.string().required(),
});

export const PreviousFunctionsView: FC = () => {
  const { setData, initialData, onClose } = useWizardContext();
  const { register, handleSubmit, setValue } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  const options = initialData.functions.map((item: NearFunction) => ({
    label: item.functionName,
    value: item.id,
  }));

  const onSubmit: SubmitHandler<IForm> = d => {
    const func = initialData.functions.find(
      (item: NearFunction) => item.functionName === d.functionName
    );

    setData({
      nearFunction: {
        id: func?.id,
        functionName: func?.functionName,
        code: func?.code,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
      <Select
        placeholder=""
        size="block"
        label="Token"
        options={options}
        {...register('functionName')}
        onChange={v => {
          setValue(
            'functionName',
            options.find(
              (item: { label: string; value: string }) => item.value === v
            )?.label ?? '',
            {
              shouldDirty: true,
            }
          );
        }}
      />
      <div className={styles.footer}>
        <Button
          variant="secondary"
          onClick={onClose}
          size="small"
          className={styles.mr8}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          size="small"
          className={styles.ml8}
        >
          Next
        </Button>
      </div>
    </form>
  );
};
