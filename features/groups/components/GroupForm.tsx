import React from 'react';
import * as yup from 'yup';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  IGroupForm,
  GroupFormType,
  GroupFormInput
} from 'features/groups/types';

import { Input } from 'components/input/Input';
import { Button } from 'components/button/Button';
import { Select } from 'components/select/Select';
import { VoteDetails } from 'components/vote-details';
import { TextArea } from 'components/textarea/TextArea';

import { ExpandableDetails } from 'features/bounty/dialogs/expandable-details';

import styles from './group-form.module.scss';

interface GroupFormProps {
  initialValues: GroupFormInput;
  onCancel: () => void;
  onSubmit: (data: IGroupForm) => void;
}

const schema = yup.object().shape({
  group: yup.string().required(),
  member: yup.string(),
  detail: yup.string(),
  externalUrl: yup.string()
});

export const GroupForm: React.FC<GroupFormProps> = ({
  initialValues,
  onCancel,
  onSubmit
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields }
  } = useForm<IGroupForm>({
    resolver: yupResolver(schema)
  });

  const renderNewGroup = () => (
    <Input
      isValid={touchedFields.group && !errors.group?.message}
      defaultValue={initialValues?.selectedGroup}
      size="block"
      textAlign="left"
      {...register('group')}
      label="Group name"
      className={cn(styles.input, styles.name)}
    />
  );

  const renderModifyGroup = () => (
    <Select
      defaultValue={initialValues.selectedGroup}
      className={styles.name}
      placeholder=""
      size="block"
      label="Group"
      options={initialValues.groups.map(group => ({
        value: group,
        label: group
      }))}
      {...register('group')}
      onChange={v =>
        setValue('group', v || 'NEAR', {
          shouldDirty: true
        })
      }
    />
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
      {initialValues?.groupType === GroupFormType.CREATE_GROUP
        ? renderNewGroup()
        : renderModifyGroup()}
      <Input
        size="block"
        defaultValue={initialValues?.name}
        isValid={touchedFields.externalUrl && !errors.externalUrl?.message}
        textAlign="left"
        {...register('memberName')}
        label={
          initialValues.groupType === GroupFormType.REMOVE_FROM_GROUP
            ? 'Remove member'
            : 'Add member'
        }
        placeholder="Member name"
        className={cn(styles.input, styles.member)}
      />
      <div className={styles.detail}>
        <TextArea
          size="block"
          defaultValue={initialValues?.detail}
          textAlign="left"
          resize="none"
          placeholder="Sample text"
          label="detail"
          {...register('detail')}
        />
      </div>
      <Input
        size="block"
        defaultValue={initialValues?.externalUrl}
        isValid={touchedFields.externalUrl && !errors.externalUrl?.message}
        textAlign="left"
        {...register('externalUrl')}
        label="External URL"
        placeholder="Add link"
        className={cn(styles.input, styles.url)}
      />

      <div className={styles.vote}>
        <ExpandableDetails label="Vote details" className={styles.voteDetails}>
          <VoteDetails {...initialValues} />
        </ExpandableDetails>
      </div>
      <div className={styles.footer}>
        <Button
          variant="secondary"
          onClick={onCancel}
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
          Propose
        </Button>
      </div>
    </form>
  );
};
