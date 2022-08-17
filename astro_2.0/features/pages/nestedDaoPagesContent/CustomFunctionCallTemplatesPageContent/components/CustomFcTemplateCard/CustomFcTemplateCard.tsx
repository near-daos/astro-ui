import React, { FC, useCallback, useMemo, useRef } from 'react';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import { FormProvider, useForm } from 'react-hook-form';
import { TFunction, useTranslation } from 'next-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import uniqid from 'uniqid';
import omit from 'lodash/omit';
import Decimal from 'decimal.js';
import cn from 'classnames';

import {
  LetterHeadWidget,
  ProposalCardRenderer,
} from 'astro_2.0/components/ProposalCardRenderer';

import { CustomFcTemplatePayload, ProposalType } from 'types/proposal';
import { DaoFeedItem } from 'types/dao';
import {
  ProposalTemplate,
  TemplateUpdatePayload,
} from 'types/proposalTemplate';

import { VALID_METHOD_NAME_REGEXP } from 'constants/regexp';
import { getGasValidation } from 'astro_2.0/features/CreateProposal/helpers';
import { CardContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard/CardContent';
import { ApplyToDaos } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard/components/ApplyToDaos';
import { DEFAULT_PROPOSAL_GAS } from 'services/sputnik/constants';
import { formatGasValue, formatYoktoValue } from 'utils/format';
import { useAllCustomTokens } from 'context/AllTokensContext';

import styles from './CustomFcTemplateCard.module.scss';

ace.config.set(
  'basePath',
  'https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/'
);

interface Props {
  daoId?: string;
  templateId?: string;
  flagCover?: string;
  template?: ProposalTemplate;
  config: CustomFcTemplatePayload;
  accountDaos?: DaoFeedItem[];
  onUpdate?: (id: string, data: TemplateUpdatePayload) => void;
  onDelete?: (id: string) => void;
  className?: string;
  onSaveToDaos?: (data: TemplateUpdatePayload[]) => Promise<void>;
  disabled: boolean;
  editable: boolean;
  name: string;
  isEnabled: boolean;
  defaultExpanded?: boolean;
}

interface Form {
  smartContractAddress: string;
  methodName: string;
  deposit: string;
  json: string;
  actionsGas: number;
  token: string;
  isActive: boolean;
  name: string;
}

function getSchema(t: TFunction) {
  return yup.object().shape({
    name: yup.string().required(t('required')),
    smartContractAddress: yup.string().required(t('required')),
    methodName: yup
      .string()
      .matches(VALID_METHOD_NAME_REGEXP, t('methodNameInvalid'))
      .required(t('required')),
    deposit: yup
      .number()
      .typeError(t('mustBeAValidNumber'))
      .required(t('required')),
    json: yup
      .string()
      .required(t('required'))
      .test('validJson', t('jsonNotValid'), value => {
        try {
          JSON.parse(value ?? '');
        } catch (e) {
          return false;
        }

        return true;
      }),
    actionsGas: getGasValidation(t),
  });
}

export const CustomFcTemplateCard: FC<Props> = ({
  daoId,
  templateId,
  template,
  flagCover,
  config,
  accountDaos,
  onUpdate,
  className,
  onDelete,
  onSaveToDaos,
  disabled,
  editable,
  name,
  isEnabled,
  defaultExpanded,
}) => {
  const { t } = useTranslation();
  const { tokens } = useAllCustomTokens();
  const tokenData = config.token ? tokens[config.token] : tokens.NEAR;
  const formKeyRef = useRef(uniqid());

  const parsedJson = useMemo(() => {
    return config.json
      ? decodeURIComponent(config.json as string)
          .trim()
          .replace(/\\/g, '')
      : '';
  }, [config.json]);

  const defaultValues = useMemo(() => {
    return {
      smartContractAddress: config.smartContractAddress,
      methodName: config.methodName,
      actionsGas: config.actionsGas
        ? Number(config.actionsGas) / 10 ** 12
        : DEFAULT_PROPOSAL_GAS,
      deposit: tokenData
        ? formatYoktoValue(config.deposit, tokenData.decimals)
        : config.deposit,
      token: config.token,
      json: parsedJson,
      isActive: isEnabled,
      name,
    };
  }, [
    config.smartContractAddress,
    config.methodName,
    config.actionsGas,
    config.deposit,
    config.token,
    tokenData,
    parsedJson,
    isEnabled,
    name,
  ]);

  // todo - filter out daos where im not a council

  const methods = useForm<Form>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(getSchema(t)),
  });

  const { handleSubmit, reset } = methods;

  const submitHandler = async (data: Form) => {
    const newTokenData = data.token ? tokens[data.token] : tokens.NEAR;
    const templatePayload = {
      ...omit(data, 'isActive'),
      deposit: new Decimal(data.deposit)
        .mul(10 ** newTokenData.decimals)
        .toFixed(),
      actionsGas: formatGasValue(
        data.actionsGas ?? DEFAULT_PROPOSAL_GAS
      ).toString(),
    };

    if (!templateId || !templatePayload) {
      return;
    }

    if (daoId && onUpdate) {
      await onUpdate(templateId, {
        daoId,
        name: data.name,
        isEnabled: data.isActive,
        config: templatePayload,
      });
    }
  };

  const handleReset = useCallback(() => {
    reset(defaultValues, {
      keepErrors: false,
      keepDirty: false,
      keepIsSubmitted: false,
      keepTouched: false,
      keepIsValid: false,
      keepSubmitCount: false,
    });
    formKeyRef.current = uniqid();
  }, [defaultValues, reset]);

  function renderContent() {
    return (
      <div className={styles.wrapper}>
        <FormProvider {...methods}>
          <form
            key={formKeyRef.current}
            noValidate
            onSubmit={handleSubmit(submitHandler)}
            className={cn(styles.root, {
              [styles.disabled]: disabled,
            })}
          >
            <CardContent
              defaultExpanded={defaultExpanded}
              disabled={!editable}
              onReset={handleReset}
              onDelete={() => templateId && onDelete && onDelete(templateId)}
              optionalControl={
                !disabled && (
                  <ApplyToDaos
                    accountDaos={accountDaos}
                    template={template}
                    className={styles.applyToDaos}
                    onSave={onSaveToDaos}
                    disabled={disabled}
                  />
                )
              }
            />
          </form>
        </FormProvider>
      </div>
    );
  }

  return (
    <ProposalCardRenderer
      className={cn(styles.container, className)}
      proposalCardNode={renderContent()}
      letterHeadNode={
        <LetterHeadWidget
          type={ProposalType.FunctionCall}
          coverUrl={flagCover}
        />
      }
    />
  );
};
