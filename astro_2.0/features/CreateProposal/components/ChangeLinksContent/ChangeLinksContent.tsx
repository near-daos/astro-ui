import React, { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { nanoid } from 'nanoid';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

import { getSocialLinkIcon } from 'utils/getSocialLinkIcon';

import { Icon } from 'components/Icon';
import { Input } from 'components/inputs/Input';
import { IconButton } from 'components/button/IconButton';
import { Button } from 'components/button/Button';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { ErrorIndicator } from 'astro_2.0/features/CreateProposal/components/ErrorIndicator';

import styles from './ChangeLinks.module.scss';

interface ChangeLinksContentProps {
  daoId: string;
}

export const ChangeLinksContent: FC<ChangeLinksContentProps> = ({ daoId }) => {
  const {
    register,
    watch,
    trigger,
    formState: { errors, touchedFields },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: 'links',
    keyName: 'id',
  });

  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.label}>{t('proposalCard.newDAOLinks')}</div>
      <div className={styles.row}>
        <div>
          {fields.map((field, index) => {
            const currentUrl = watch(`links.${index}.url`);
            const icon = getSocialLinkIcon(currentUrl);

            const error = errors[`links[${index}].url`];

            return (
              <div className={styles.row} key={field.id}>
                <Icon
                  name={icon}
                  className={cn(styles.icon, {
                    [styles.error]: !!error,
                  })}
                />

                <Input
                  isBorderless
                  {...register(`links.${index}.url`)}
                  defaultValue={currentUrl}
                  onKeyUp={async () => {
                    await trigger();
                  }}
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
                {error && <ErrorIndicator message={error.message} />}
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

      <div className={cn(styles.row, styles.target)}>
        <InfoBlockWidget
          label={t('proposalCard.proposalTarget')}
          value={daoId}
          valueFontSize="S"
        />
      </div>
    </div>
  );
};
