import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';

import { Checkbox } from 'components/inputs/Checkbox';
import { Button } from 'components/button/Button';

import { useDaoSettings } from 'context/DaoSettingsContext';
import { useWalletContext } from 'context/WalletContext';

import { isCouncilUser } from 'astro_2.0/features/DraftComments/helpers';

import { DAO } from 'types/dao';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import styles from './DraftSettings.module.scss';

interface Props {
  dao: DAO;
}

interface Form {
  allowCreateDraftByAnyUser: boolean;
}

export const DraftSettings: FC<Props> = ({ dao }) => {
  const { t } = useTranslation();
  const { accountId } = useWalletContext();
  const { settings, update } = useDaoSettings();
  const isCouncil = isCouncilUser(dao, accountId);

  const isChecked = settings?.drafts?.allowCreateDraftByAnyUser ?? false;

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<Form>({
    defaultValues: {
      allowCreateDraftByAnyUser: isChecked ?? false,
    },
  });

  const value = watch('allowCreateDraftByAnyUser');

  const onSubmit = async (values: Form) => {
    try {
      await update({
        drafts: {
          ...values,
        },
      });

      showNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        description: 'Successfully updated DAO settings',
        lifetime: 5000,
      });

      reset(values);
    } catch (e) {
      showNotification({
        type: NOTIFICATION_TYPES.ERROR,
        description: `Failed to update DAO settings, ${e}`,
        lifetime: 5000,
      });
    }
  };

  return (
    <form className={styles.root} noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.header}>
        <div className={styles.label}>Draft proposals</div>
        <div className={styles.buttons}>
          {isDirty && (
            <>
              <Button
                size="small"
                variant="secondary"
                capitalize
                className={styles.cancelBtn}
                onClick={() => {
                  reset(
                    { allowCreateDraftByAnyUser: isChecked },
                    { keepDefaultValues: true }
                  );
                }}
              >
                Cancel
              </Button>

              <Button size="small" variant="primary" capitalize type="submit">
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      <div className={styles.option}>
        <Checkbox
          className={styles.checkbox}
          checked={value}
          disabled={!isCouncil}
          label={t(
            'daoPolicy.settings.drafts.allowNonDaoMembersToCreateDrafts'
          )}
          onClick={() =>
            setValue('allowCreateDraftByAnyUser', !value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
      </div>
    </form>
  );
};
