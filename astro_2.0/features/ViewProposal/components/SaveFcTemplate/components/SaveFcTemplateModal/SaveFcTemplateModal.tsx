import React, { FC, useMemo } from 'react';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal } from 'components/modal';

import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { Input } from 'components/inputs/Input';
import { Button } from 'components/button/Button';
import {
  DropdownMultiSelect,
  Option,
} from 'components/inputs/selects/DropdownMultiSelect';
import { Badge } from 'components/Badge';

import { DaoFeedItem } from 'types/dao';
import { ProposalFeedItem } from 'types/proposal';

import { getFcTemplateFromProposal } from 'astro_2.0/features/ViewProposal/components/SaveFcTemplate/components/SaveFcTemplateModal/helpers';

import styles from './SaveFcTemplateModal.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  accountDaos: DaoFeedItem[];
  proposal: ProposalFeedItem;
}

type Form = {
  name: string;
  daos: string[];
};

export const SaveFcTemplateModal: FC<Props> = ({
  isOpen,
  onClose,
  accountDaos,
  proposal,
}) => {
  const daosOptions = useMemo<Option[]>(() => {
    return accountDaos.map(item => ({
      label: item.id,
      component: <span className={styles.listItem}>{item.id}</span>,
    }));
  }, [accountDaos]);

  const schema = yup.object().shape({
    name: yup.string().required('Required'),
    daos: yup.array().of(yup.string()).min(1).required(),
  });

  const methods = useForm<Form>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      daos: [],
    },
    resolver: yupResolver(schema),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = methods;

  const submitHandler = (data: Form) => {
    const templatePayload = getFcTemplateFromProposal(proposal);

    if (!templatePayload) {
      return onClose();
    }

    const dataToSave = data.daos.map(daoId => ({
      id: '1',
      daoId,
      name: data.name,
      payload: templatePayload,
      isActive: true,
    }));

    // todo - save template data to API
    // eslint-disable-next-line no-console
    console.log(dataToSave);

    return onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      className={styles.modalRoot}
    >
      <FormProvider {...methods}>
        <form
          noValidate
          className={styles.root}
          onSubmit={handleSubmit(submitHandler)}
        >
          <h2>Save template</h2>
          <div className={styles.inputWrapper}>
            <InputWrapper fieldName="name" label="Add Name" fullWidth>
              <Input
                {...register('name')}
                size="block"
                inputClassName={styles.input}
                placeholder="Template Name"
              />
            </InputWrapper>
          </div>

          <div className={styles.inputWrapper}>
            <InputWrapper fieldName="daos" label="Choose DAO" fullWidth>
              <DropdownMultiSelect
                menuClassName={styles.menuClassName}
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
            </InputWrapper>
          </div>

          <div className={styles.footer}>
            <Button
              capitalize
              disabled={!isValid}
              type="submit"
              size="block"
              className={styles.confirmButton}
            >
              Save template
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
