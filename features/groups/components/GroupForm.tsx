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

import { Input } from 'components/inputs/input/Input';
import { Button } from 'components/button/Button';
import { Select } from 'components/inputs/select/Select';
import { VoteDetails } from 'components/vote-details';
import { TextArea } from 'components/inputs/textarea/TextArea';

import { ExpandableDetails } from 'features/bounty/dialogs/expandable-details';

import styles from './group-form.module.scss';

interface GroupFormProps {
  initialValues: GroupFormInput;
  onCancel: () => void;
  onSubmit: (data: IGroupForm) => void;
}

const schema = yup.object().shape({
  group: yup.string().required(),
  memberName: yup.string().required(),
  detail: yup.string().required(),
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

  const getVoteDetailsScope = (groupType: number) => {
    switch (groupType) {
      case GroupFormType.REMOVE_FROM_GROUP:
        return 'removeMemberFromRole';
      case GroupFormType.ADD_TO_GROUP:
        return 'addMemberToRole';
      default:
        return 'policy';
    }
  };

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
      defaultValue={initialValues?.selectedGroup}
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
        isValid={touchedFields.memberName && !errors.memberName?.message}
        textAlign="left"
        {...register('memberName')}
        label="Member name"
        placeholder="Member name"
        className={cn(styles.input, styles.member)}
      />
      <div className={styles.detail}>
        <TextArea
          size="block"
          isValid={touchedFields.detail && !errors.detail?.message}
          defaultValue={initialValues?.detail}
          textAlign="left"
          maxLength={500}
          resize="none"
          placeholder="Sample text"
          label="Details"
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
          <VoteDetails scope={getVoteDetailsScope(initialValues.groupType)} />
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
