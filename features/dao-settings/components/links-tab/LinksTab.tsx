import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'components/button/Button';
import { IconButton } from 'components/button/IconButton';

import { Icon } from 'components/Icon';
import { Input } from 'components/input/Input';
import { ProposalBanner } from 'features/dao-settings/components/proposal-banner';
import { getSocialLinkIcon } from 'helpers/getSocialLinkIcon';
import { nanoid } from 'nanoid';
import React, { FC, useCallback } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useToggle } from 'react-use';
import { validUrlRegexp } from 'utils/regexp';
import * as yup from 'yup';

import { DaoConfig } from 'types/proposal';
import { fromMetadataToBase64 } from 'services/SputnikService/mappers/dao';
import { SputnikService } from 'services/SputnikService';
import { getChangeConfigProposal } from 'features/dao-settings/helpers';
import styles from './links-tab.module.scss';

type ExternalLink = {
  id: string;
  url: string;
};

export interface LinksTabProps {
  accountName: string;
  links: string[];
  currentDaoSettings: {
    name: string;
    purpose: string;
    flag: string;
  };
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
        .required('Enter url')
    })
  )
});

const LinksTab: FC<LinksTabProps> = ({
  links,
  accountName,
  currentDaoSettings
}) => {
  const [viewMode, setViewMode] = useToggle(true);

  const methods = useForm<LinksFormData>({
    mode: 'onChange',
    defaultValues: {
      links: links.map(url => ({
        url,
        id: nanoid()
      })),
      details: '',
      externalUrl: ''
    },
    resolver: yupResolver(schema)
  });

  const {
    register,
    reset,
    watch,
    handleSubmit,
    control,
    formState: { errors, touchedFields, isDirty, isValid }
  } = methods;

  const { fields, append, remove } = useFieldArray({
    name: 'links',
    keyName: 'id',
    control
  });

  const onCancel = useCallback(() => {
    setViewMode(true);
    reset({
      links: links.map(url => ({
        url,
        id: nanoid()
      }))
    });
  }, [links, reset, setViewMode]);

  const onSubmit = useCallback(
    async (data: LinksFormData) => {
      const url = currentDaoSettings.flag.split('/');
      const fileName = url[url.length - 1];

      const newDaoConfig: DaoConfig = {
        name: currentDaoSettings.name,
        purpose: currentDaoSettings.purpose,
        metadata: fromMetadataToBase64({
          links: data.links.map(item => item.url),
          flag: fileName
        })
      };

      await SputnikService.createProposal(
        getChangeConfigProposal(accountName, newDaoConfig, 'Changing links')
      );
      setViewMode(true);
    },
    [currentDaoSettings, accountName, setViewMode]
  );

  return (
    <>
      <FormProvider {...methods}>
        <ProposalBanner
          scope="config"
          title="Links"
          form="links"
          disable={!isValid || !isDirty}
          onEdit={setViewMode}
          viewMode={viewMode}
          onCancel={onCancel}
        />
      </FormProvider>
      <form
        id="links"
        onSubmit={handleSubmit(onSubmit)}
        className={styles.root}
      >
        <div className={styles.row}>
          <div className={styles.label}>Links</div>
        </div>
        {viewMode
          ? links.map(item => {
              const icon = getSocialLinkIcon(item);

              return (
                <div className={styles.row} key={item}>
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

        {!viewMode && (
          <div className={styles.row}>
            <Button
              className={styles.add}
              variant="tertiary"
              onClick={() =>
                append({
                  id: nanoid(),
                  url: ''
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
