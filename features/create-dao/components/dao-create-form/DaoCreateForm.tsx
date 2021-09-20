import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'components/button/Button';
import { IconButton } from 'components/button/IconButton';
import { Icon } from 'components/Icon';
import { Input } from 'components/input/Input';
import { TextArea } from 'components/textarea/TextArea';
import { Title } from 'components/Typography';
import { getSocialLinkIcon } from 'helpers/getSocialLinkIcon';
import React, { FC, HTMLProps, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { validUrlRegexp, validWebsiteName } from 'utils/regexp';
import * as yup from 'yup';
import styles from './dao-create-form.module.scss';

interface DaoCreateFormProps
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
  address: yup
    .string()
    .matches(validWebsiteName, 'Enter correct address!')
    .required(),
  displayName: yup.string().required(),
  purpose: yup.string().max(500),
  websites: yup
    .array()
    .of(yup.string().matches(validUrlRegexp, 'Enter correct url!').required())
});

export const DaoCreateForm: FC<DaoCreateFormProps> = ({
  onSubmit,
  initialValues = { websites: [''] },
  ...props
}) => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, touchedFields }
  } = useForm<IDaoCreateForm>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: initialValues
  });

  const [linksCount, setLinksCount] = useState(
    initialValues?.websites?.length ?? 0
  );

  function addLink() {
    setLinksCount(count => count + 1);
  }

  function removeLink(index: number) {
    const websites = getValues('websites');

    websites.splice(index, 1);

    setValue('websites', websites);
    setLinksCount(count => count - 1);
  }

  return (
    <form {...props} onSubmit={handleSubmit(onSubmit)} className={styles.root}>
      <section className={styles.addressSection}>
        <div className={styles.addressInput}>
          <Input
            isValid={touchedFields.address && !errors.address?.message}
            size="block"
            textAlign="left"
            {...register('address')}
            label="DAO ADDRESS"
          />
          .sputnikdao.near
        </div>
        <p className={styles.addressAlert}>
          <Icon width={24} name="buttonAlert" />
          Choose wisely. You can&apos;t change this later.
        </p>
      </section>

      <section className={styles.info}>
        <Input
          isValid={touchedFields.displayName && !errors.displayName?.message}
          size="block"
          {...register('displayName')}
          label="display name"
        />

        <TextArea
          size="block"
          maxLength={500}
          {...register('purpose')}
          label="Purpose"
        />
      </section>

      <section className={styles.links}>
        <Title size={5}>Links</Title>
        {Array.from({ length: linksCount }, (_, i) => i).map(index => (
          <div className={styles.link} key={index}>
            <Icon
              className={styles.socialIcon}
              name={getSocialLinkIcon(getValues(`websites.${index}` as const))}
              width={24}
            />
            <Input
              placeholder="https://"
              {...register(`websites.${index}` as const, {
                shouldUnregister: true
              })}
              key={`websites.${index}` as const}
              isValid={
                touchedFields.websites?.[index] &&
                !errors.websites?.[index]?.message
              }
              size="block"
            />
            <IconButton
              className={styles.deleteBtn}
              onClick={() => removeLink(index)}
              size="medium"
              icon="buttonDelete"
            />
          </div>
        ))}

        <Button
          className={styles.addLinkButton}
          type="button"
          onClick={addLink}
          variant="tertiary"
        >
          <Icon width={24} name="buttonAdd" /> Add Links
        </Button>
      </section>
    </form>
  );
};
