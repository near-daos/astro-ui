import React, { FC, useCallback, useMemo, useRef } from 'react';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import uniqid from 'uniqid';

import {
  LetterHeadWidget,
  ProposalCardRenderer,
} from 'astro_2.0/components/ProposalCardRenderer';
import { DaoContext } from 'types/context';
import { CustomFcTemplate, ProposalType } from 'types/proposal';
import { DaoFeedItem } from 'types/dao';

import { VALID_METHOD_NAME_REGEXP } from 'constants/regexp';
import { gasValidation } from 'astro_2.0/features/CreateProposal/helpers';
import { CardContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard/CardContent';
import { ApplyToDaos } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard/components/ApplyToDaos';
import { CustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { DEFAULT_PROPOSAL_GAS } from 'services/sputnik/constants';
import { Tokens } from 'context/CustomTokensContext';

import styles from './CustomFcTemplateCard.module.scss';

ace.config.set(
  'basePath',
  'https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/'
);

interface Props {
  daoContext: DaoContext;
  daoTokens: Tokens;
  template: CustomFcTemplate;
  accountDaos: DaoFeedItem[];
}

interface Form {
  smartContractAddress: string;
  methodName: string;
  deposit: number;
  json: string;
  actionsGas: number;
  isActive: boolean;
  name: string;
}

export const CustomFcTemplateCard: FC<Props> = ({
  daoContext,
  template,
  daoTokens,
  accountDaos,
}) => {
  const { dao } = daoContext;
  const { payload } = template;
  const formKeyRef = useRef(uniqid());

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

  const parsedJson = useMemo(() => {
    return payload.json
      ? decodeURIComponent(payload.json as string)
          .trim()
          .replace(/\\/g, '')
      : '';
  }, [payload.json]);

  const defaultValues = useMemo(() => {
    return {
      smartContractAddress: payload.smartContractAddress,
      methodName: payload.methodName,
      actionsGas: Number(payload.actionsGas ?? DEFAULT_PROPOSAL_GAS),
      deposit: Number(payload.deposit ?? '0'),
      json: parsedJson,
      isActive: template.isActive,
      name: template.name,
    };
  }, [
    parsedJson,
    payload.actionsGas,
    payload.deposit,
    payload.methodName,
    payload.smartContractAddress,
    template.isActive,
    template.name,
  ]);

  const methods = useForm<Form>({
    mode: 'all',
    reValidateMode: 'onChange',

    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, reset } = methods;

  const submitHandler = (data: Form) => {
    // eslint-disable-next-line no-console
    console.log(data);
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
        <CustomTokensContext.Provider value={{ tokens: daoTokens }}>
          <FormProvider {...methods}>
            <form
              key={formKeyRef.current}
              noValidate
              onSubmit={handleSubmit(submitHandler)}
              className={styles.root}
            >
              <CardContent onReset={handleReset} />
            </form>
          </FormProvider>
        </CustomTokensContext.Provider>
        <ApplyToDaos
          accountDaos={accountDaos}
          template={template}
          className={styles.applyToDaos}
        />
      </div>
    );
  }

  return (
    <ProposalCardRenderer
      className={styles.container}
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
