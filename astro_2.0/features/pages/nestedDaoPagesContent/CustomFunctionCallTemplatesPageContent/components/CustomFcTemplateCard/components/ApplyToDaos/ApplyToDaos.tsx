import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Badge } from 'components/Badge';
import {
  DropdownMultiSelect,
  Option,
} from 'components/inputs/selects/DropdownMultiSelect';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';

import { DaoFeedItem } from 'types/dao';
import {
  ProposalTemplate,
  TemplateUpdatePayload,
} from 'types/proposalTemplate';

import styles from './ApplyToDaos.module.scss';

interface Props {
  accountDaos: DaoFeedItem[];
  template: ProposalTemplate;
  className?: string;
  onSave: (data: TemplateUpdatePayload[]) => Promise<void>;
}

interface Form {
  daos: string[];
}

const schema = yup.object().shape({
  daos: yup.array().of(yup.string()).min(1).required(),
});

export const ApplyToDaos: FC<Props> = ({
  accountDaos,
  template,
  className,
  onSave,
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

  const submitHandler = async (data: Form) => {
    const templatePayload = template.config;

    const dataToSave = data.daos.map(daoId => ({
      daoId,
      name: template.name,
      config: templatePayload,
      isEnabled: true,
    }));

    await onSave(dataToSave);
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
