import last from 'lodash/last';
import { useRouter } from 'next/router';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'components/button/Button';
import { IconButton } from 'components/button/IconButton';

import { Icon } from 'components/Icon';
import { Input } from 'components/inputs/input/Input';
import { ProposalBanner } from 'features/dao-settings/components/proposal-banner';
import { getSocialLinkIcon } from 'helpers/getSocialLinkIcon';
import { nanoid } from 'nanoid';
import React, { FC, useCallback } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useToggle } from 'react-use';
import { validUrlRegexp } from 'utils/regexp';
import * as yup from 'yup';

import { SputnikWalletError } from 'errors/SputnikWalletError';
import { DaoConfig } from 'types/proposal';
import {
  DaoMetadata,
  fromMetadataToBase64,
} from 'services/sputnik/mappers/dao';
import { SputnikNearService } from 'services/sputnik';
import {
  navigateToDaoPage,
  getChangeConfigProposal,
} from 'features/dao-settings/helpers';
import { EditButton } from 'features/dao-settings/components/edit-button/EditButton';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import styles from './links-tab.module.scss';

type ExternalLink = {
  id: string;
  url: string;
};

export interface LinksTabProps {
  daoId: string;
  name: string;
  purpose: string;
  currentDaoMetadata: DaoMetadata;
  proposalBond: string;
}

export interface LinksFormData {
  links: ExternalLink[];
  details: '';
  externalUrl: '';
}

export const schema = yup.object().shape({
  links: yup.array().of(
    yup.object().shape({
      id: yup.string().required(),
      url: yup
        .string()
        .matches(validUrlRegexp, 'Enter correct url!')
        .required('Enter url'),
    })
  ),
});

const LinksTab: FC<LinksTabProps> = ({
  daoId,
  name,
  purpose,
  currentDaoMetadata,
  proposalBond,
}) => {
  const router = useRouter();

  const { links } = currentDaoMetadata;
  const [viewMode, setViewMode] = useToggle(true);

  const methods = useForm<LinksFormData>({
    mode: 'onChange',
    defaultValues: {
      links: links.map(url => ({
        url,
        id: nanoid(),
      })),
      details: '',
      externalUrl: '',
    },
    resolver: yupResolver(schema),
  });

  const {
    register,
    reset,
    watch,
    handleSubmit,
    control,
    formState: { errors, touchedFields, isDirty, isValid },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    name: 'links',
    keyName: 'id',
    control,
  });

  const onCancel = useCallback(() => {
    setViewMode(true);
    reset({
      links: links.map(url => ({
        url,
        id: nanoid(),
      })),
    });
  }, [links, reset, setViewMode]);

  const onSubmit = useCallback(
    async (data: LinksFormData) => {
      try {
        const url = currentDaoMetadata.flag?.split('/');
        const fileName = last(url);

        const newDaoConfig: DaoConfig = {
          name,
          purpose,
          metadata: fromMetadataToBase64({
            links: data.links.map(item => item.url),
            flag: fileName,
            displayName: currentDaoMetadata.displayName,
          }),
        };

        await SputnikNearService.createProposal(
          getChangeConfigProposal(
            daoId,
            newDaoConfig,
            'Changing links',
            proposalBond
          )
        );
        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: `The blockchain transactions might take some time to perform, please visit DAO details page in few seconds`,
          lifetime: 20000,
        });
        setViewMode(true);

        navigateToDaoPage(router);
      } catch (error) {
        console.warn(error);

        if (error instanceof SputnikWalletError) {
          showNotification({
            type: NOTIFICATION_TYPES.ERROR,
            description: error.message,
            lifetime: 20000,
          });
        }
      }
    },
    [
      name,
      router,
      purpose,
      currentDaoMetadata,
      daoId,
      setViewMode,
      proposalBond,
    ]
  );

  return (
    <>
      <FormProvider {...methods}>
        {!viewMode && (
          <ProposalBanner
            scope="config"
            title="Links"
            form="links"
            disable={!isValid || !isDirty}
            onEdit={setViewMode}
            viewMode={viewMode}
            onCancel={onCancel}
          />
        )}
      </FormProvider>

      <form
        id="links"
        onSubmit={handleSubmit(onSubmit)}
        className={styles.root}
      >
        <div className={styles.label}>Links</div>
        <div className={styles.row}>
          <div>
            {viewMode
              ? links.map(item => {
                  const icon = getSocialLinkIcon(item);

                  return (
                    <div key={item}>
                      <Icon name={icon} className={styles.icon} />
                      <span>{item}</span>
                    </div>
                  );
                })
              : fields.map((field, index) => {
                  const currentUrl = watch(`links.${index}.url`);
                  const icon = getSocialLinkIcon(currentUrl);

                  return (
                    <div className={styles.row} key={field.id}>
                      <Icon name={icon} className={styles.icon} />

                      <Input
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
          {viewMode && <EditButton onClick={setViewMode} />}
        </div>

        {!viewMode && (
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
              <span>Add link</span>
            </Button>
          </div>
        )}
      </form>
    </>
  );
};

export default LinksTab;
