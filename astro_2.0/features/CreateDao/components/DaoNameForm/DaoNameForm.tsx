import React, { FC, HTMLProps } from 'react';
import * as yup from 'yup';
import { nearConfig } from 'config';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from 'components/inputs/input/Input';
import { TextArea } from 'components/inputs/textarea/TextArea';
import { validWebsiteName } from 'utils/regexp';
import { formatDaoAddress } from './helpers';
import styles from './DaoNameForm.module.scss';

interface DaoNameFormProps
  extends Omit<HTMLProps<HTMLFormElement>, 'onSubmit'> {
  initialValues?: Partial<IDaoCreateForm>;
  onSubmit: SubmitHandler<IDaoCreateForm>;
}

export interface IDaoCreateForm {
  address: string;
  displayName: string;
  purpose: string;
  websites: string[];
  flag: File;
  flagPreview: string;
}

const schema = yup.object().shape({
  displayName: yup
    .string()
    .trim()
    .min(3, 'tooShortAddress')
    .matches(validWebsiteName, 'incorrectAddress')
    .required(),
  purpose: yup.string().max(500),
});

export const DaoNameForm: FC<DaoNameFormProps> = ({
  onSubmit,
  initialValues = { websites: [''] },
  ...props
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<IDaoCreateForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const displayName = watch('displayName');

  const showDaoNameErrorMessage = (message: string) => {
    switch (message) {
      case 'tooShortAddress':
        return 'at least 3 characters expected.';
      case 'incorrectAddress':
        return 'you can use letters and numbers only with hyphens and spaces in the middle.';
      default:
      case '':
        return '';
    }
  };

  return (
    <form {...props} onSubmit={handleSubmit(onSubmit)} className={styles.root}>
      <div className={styles.header}>
        <h2>DAO name and purpose</h2>
        <p>All fields bellow, unless otherwise noted are required.</p>
      </div>

      <div className={styles.card}>
        <section className={styles.name}>
          <div className={styles.label}>DAO Name</div>
          <div className={styles.nameInput}>
            <Input
              isValid={
                touchedFields.displayName && !errors.displayName?.message
              }
              placeholder="Sample DAO Name"
              size="block"
              isBorderless
              {...register('displayName')}
            />
          </div>

          {errors.displayName?.message && (
            <div className={styles.nameError}>
              Incorrect DAO name&nbsp;&mdash;{' '}
              {showDaoNameErrorMessage(errors.displayName?.message)}
            </div>
          )}
        </section>

        <section className={styles.address}>
          <div className={styles.label}>
            DAO Address <span className={styles.warning}>(auto filled)</span>
          </div>
          <div className={styles.addressText}>
            {displayName ? (
              formatDaoAddress(displayName)
            ) : (
              <span className={styles.addressPlaceholder}>sampledaoname</span>
            )}
            .{nearConfig.contractName}
          </div>
        </section>

        <section className={styles.purpose}>
          <div className={styles.label}>Puprose</div>
          <div className={styles.purposeText}>
            <TextArea
              size="block"
              minRows={1}
              maxRows={5}
              placeholder="Sample text. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient."
              maxLength={500}
              isBorderless
              {...register('purpose')}
            />
          </div>
        </section>
      </div>
    </form>
  );
};
