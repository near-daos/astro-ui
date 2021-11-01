import React, { FC, HTMLProps, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Icon } from 'components/Icon';
import { Input } from 'components/inputs/input/Input';
import { Button } from 'components/button/Button';
import { IconButton } from 'components/button/IconButton';
import { getSocialLinkIcon } from 'helpers/getSocialLinkIcon';
import { validUrlRegexp } from 'utils/regexp';
import styles from './DaoLinksForm.module.scss';

interface DaoLinksFormProps
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
  websites: yup
    .array()
    .of(yup.string().matches(validUrlRegexp, 'Enter correct url!').required()),
});

export const DaoLinksForm: FC<DaoLinksFormProps> = ({
  onSubmit,
  initialValues = { websites: [''] },
  ...props
}) => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, touchedFields },
  } = useForm<IDaoCreateForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: initialValues,
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
      <div className={styles.header}>
        <h2>Links and socials</h2>
        <p>
          Looking to&nbsp;grow the DAO members? Add links to&nbsp;allow people
          to&nbsp;learn more about your DAO.
        </p>
      </div>

      <section className={styles.links}>
        {Array.from({ length: linksCount }, (_, i) => i).map(index => (
          <div className={styles.link} key={index}>
            <Icon
              className={styles.socialIcon}
              name={getSocialLinkIcon(getValues(`websites.${index}` as const))}
              width={24}
            />
            <Input
              isValid={
                touchedFields.websites?.[index] &&
                !errors.websites?.[index]?.message
              }
              key={`websites.${index}` as const}
              placeholder="https://"
              {...register(`websites.${index}` as const, {
                shouldUnregister: true,
              })}
              size="block"
            />
            <IconButton
              className={styles.deleteBtn}
              icon="buttonDelete"
              onClick={() => removeLink(index)}
              size="medium"
            />
          </div>
        ))}

        <Button className={styles.link} onClick={addLink} variant="transparent">
          <Icon
            className={styles.socialIcon}
            name="socialPlaceholder"
            width={24}
          />
          <span className={styles.socialText}>https://</span>
          <Icon className={styles.addBtn} name="buttonAdd" width={24} />
        </Button>
      </section>
    </form>
  );
};
