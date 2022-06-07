import React, { VFC } from 'react';
import { useTranslation } from 'next-i18next';

import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { DiffRenderer } from 'astro_2.0/features/ViewProposal/components/DiffRenderer';

import styles from './CommonContent.module.scss';

interface CommonContentProps {
  json: string;
  methodName: string;
  smartContractAddress: string;
  compareOptions?: {
    json: string;
    methodName: string;
    smartContractAddress: string;
  };
}

export const CommonContent: VFC<CommonContentProps> = ({
  json,
  methodName,
  smartContractAddress,
  compareOptions,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.address}>
        <FieldWrapper label={t('proposalCard.smartContractAddress')}>
          <FieldValue
            value={
              compareOptions ? (
                <DiffRenderer
                  newValue={smartContractAddress}
                  oldValue={compareOptions.smartContractAddress}
                />
              ) : (
                smartContractAddress
              )
            }
          />
        </FieldWrapper>
      </div>

      <div className={styles.method}>
        <FieldWrapper label={t('proposalCard.methodName')}>
          <FieldValue
            value={
              compareOptions ? (
                <DiffRenderer
                  newValue={methodName}
                  oldValue={compareOptions.methodName}
                />
              ) : (
                methodName
              )
            }
          />
        </FieldWrapper>
      </div>

      <div className={styles.editor}>
        <FieldWrapper label={t('proposalCard.json')}>
          {compareOptions ? (
            <DiffRenderer
              newValue={json}
              oldValue={compareOptions.json}
              codeView
            />
          ) : (
            <pre>{json}</pre>
          )}
        </FieldWrapper>
      </div>
    </div>
  );
};
