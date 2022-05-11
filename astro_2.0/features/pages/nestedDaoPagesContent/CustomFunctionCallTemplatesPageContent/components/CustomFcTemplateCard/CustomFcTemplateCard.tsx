import React, { FC, useCallback, useMemo, useRef } from 'react';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import { FormProvider, useForm } from 'react-hook-form';
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

import { DaoContext } from 'types/context';
import { ProposalType } from 'types/proposal';
import { DaoFeedItem } from 'types/dao';
import {
  ProposalTemplate,
  TemplateUpdatePayload,
} from 'types/proposalTemplate';

import { VALID_METHOD_NAME_REGEXP } from 'constants/regexp';
import { gasValidation } from 'astro_2.0/features/CreateProposal/helpers';
import { CardContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard/CardContent';
import { ApplyToDaos } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard/components/ApplyToDaos';
import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { DEFAULT_PROPOSAL_GAS } from 'services/sputnik/constants';
import { formatGasValue, formatYoktoValue } from 'utils/format';

import styles from './CustomFcTemplateCard.module.scss';

ace.config.set(
  'basePath',
  'https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/'
);

interface Props {
  daoContext: DaoContext;
  template: ProposalTemplate;
  accountDaos: DaoFeedItem[];
  onUpdate: (id: string, data: TemplateUpdatePayload) => void;
  onDelete: (id: string) => void;
  className?: string;
  onSaveToDaos: (data: TemplateUpdatePayload[]) => Promise<void>;
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

const schema = yup.object().shape({
  name: yup.string().required('Required'),
  smartContractAddress: yup.string().required('Required'),
  methodName: yup
    .string()
    .matches(VALID_METHOD_NAME_REGEXP, 'Provided method name is not valid')
    .required('Required'),
  deposit: yup
    .number()
    .typeError('Must be a valid number.')
    .required('Required'),
  json: yup
    .string()
    .required('Required')
    .test('validJson', 'Provided JSON is not valid', value => {
      try {
        JSON.parse(value ?? '');
      } catch (e) {
        return false;
      }

      return true;
    }),
  actionsGas: gasValidation,
});

export const CustomFcTemplateCard: FC<Props> = ({
  daoContext,
  template,
  accountDaos,
  onUpdate,
  className,
  onDelete,
  onSaveToDaos,
}) => {
  const { dao } = daoContext;
  const { config } = template;
  const { tokens } = useCustomTokensContext();
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
      isActive: template.isEnabled,
      name: template.name,
    };
  }, [
    config.smartContractAddress,
    config.methodName,
    config.actionsGas,
    config.deposit,
    config.token,
    tokenData,
    parsedJson,
    template.isEnabled,
    template.name,
  ]);

  const methods = useForm<Form>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
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

    if (!template.id || !templatePayload) {
      return;
    }

    await onUpdate(template.id, {
      daoId: dao.id,
      name: data.name,
      isEnabled: data.isActive,
      config: templatePayload,
    });
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
            className={styles.root}
          >
            <CardContent
              onReset={handleReset}
              onDelete={() => template.id && onDelete(template.id)}
            />
          </form>
        </FormProvider>
        <ApplyToDaos
          accountDaos={accountDaos}
          template={template}
          className={styles.applyToDaos}
          onSave={onSaveToDaos}
        />
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
          coverUrl={dao.flagCover}
        />
      }
    />
  );
};
