import React, { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { nanoid } from 'nanoid';

import { getSocialLinkIcon } from 'helpers/getSocialLinkIcon';

import { Icon } from 'components/Icon';
import { Input } from 'components/inputs/input/Input';
import { IconButton } from 'components/button/IconButton';
import { Button } from 'components/button/Button';
import { InfoBlockWidget } from 'astro_2.0/components/ProposalCardRenderer/components/InfoBlockWidget';

import styles from './ChangeLinks.module.scss';

interface ChangeLinksContentProps {
  daoId: string;
}

export const ChangeLinksContent: FC<ChangeLinksContentProps> = ({ daoId }) => {
  const {
    register,
    watch,
    // setValue,
    // getValues,
    formState: { errors, touchedFields },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: 'links',
    keyName: 'id',
  });

  return (
    <div className={styles.root}>
      <div className={styles.label}>New DAO links</div>
      <div className={styles.row}>
        <div>
          {fields.map((field, index) => {
            const currentUrl = watch(`links.${index}.url`);
            const icon = getSocialLinkIcon(currentUrl);

            return (
              <div className={styles.row} key={field.id}>
                <Icon name={icon} className={styles.icon} />

                <Input
                  isBorderless
                  {...register(`links.${index}.url`)}
                  isValid={
                    touchedFields?.links?.[index]?.url &&
                    !errors?.links?.[index]?.url?.message
                  }
                  size="medium"
                  textAlign="left"
                />
                <IconButton
                  onClick={() => remove(index)}
                  icon="buttonDelete"
                  className={styles.delete}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.row}>
        <Button
          className={styles.add}
          variant="tertiary"
          onClick={() =>
            append({
              id: nanoid(),
              url: '',
            })
          }
        >
          <Icon name="buttonAdd" className={styles.icon} />
        </Button>
      </div>

      <div className={styles.row}>
        <InfoBlockWidget label="Target" value={daoId} valueFontSize="S" />
      </div>
    </div>
  );
};
