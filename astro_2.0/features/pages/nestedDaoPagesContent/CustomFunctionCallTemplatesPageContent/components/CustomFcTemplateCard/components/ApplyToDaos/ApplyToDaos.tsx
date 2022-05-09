import React, { FC, useMemo } from 'react';
import cn from 'classnames';

import { Badge } from 'components/Badge';
import {
  DropdownMultiSelect,
  Option,
} from 'components/inputs/selects/DropdownMultiSelect';
import { DaoFeedItem } from 'types/dao';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CustomFcTemplate } from 'types/proposal';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';

import styles from './ApplyToDaos.module.scss';

interface Props {
  accountDaos: DaoFeedItem[];
  template: CustomFcTemplate;
  className?: string;
}

interface Form {
  daos: string[];
}

export const ApplyToDaos: FC<Props> = ({
  accountDaos,
  template,
  className,
}) => {
  const daosOptions = useMemo<Option[]>(() => {
    return accountDaos.map(item => ({
      label: item.id,
      component: (
        <span className={styles.listItem} key={item.id}>
          {item.id}
        </span>
      ),
    }));
  }, [accountDaos]);

  const schema = yup.object().shape({
    daos: yup.array().of(yup.string()).min(1).required(),
  });

  const methods = useForm<Form>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      daos: [],
    },
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    setValue,
    formState: { isValid },
  } = methods;

  const submitHandler = (data: Form) => {
    const templatePayload = template.payload;

    const dataToSave = data.daos.map(daoId => ({
      id: '1',
      daoId,
      name: template.name,
      payload: templatePayload,
      isActive: true,
    }));

    // todo - save template data to API
    // eslint-disable-next-line no-console
    console.log(dataToSave);
  };

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        className={cn(styles.root, className)}
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className={styles.row}>
          <DropdownMultiSelect
            className={styles.selector}
            menuClassName={styles.menu}
            selectedItemRenderer={item => (
              <Badge
                key={item.label}
                variant="lightgray"
                size="small"
                className={styles.selectedItem}
              >
                <div className={styles.ellipsed}>{item.label}</div>
              </Badge>
            )}
            label=""
            options={daosOptions}
            onChange={val => {
              setValue('daos', val, { shouldValidate: true });
            }}
          />
          <Button
            size="small"
            capitalize
            type="submit"
            className={styles.button}
            disabled={!isValid}
          >
            <Icon name="plus" className={styles.icon} />
            Apply
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
