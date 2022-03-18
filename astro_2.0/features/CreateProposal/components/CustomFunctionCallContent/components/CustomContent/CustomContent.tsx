import React, { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';
import AceEditor from 'react-ace';

import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { DropdownSelect } from 'components/inputs/selects/DropdownSelect';

import { Input } from 'components/inputs/Input';

import {
  DEFAULT_PROPOSAL_GAS,
  MAX_GAS,
  MIN_GAS,
} from 'services/sputnik/constants';

import {
  useDepositWidth,
  useTokenOptions,
} from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/hooks';

import styles from './CustomContent.module.scss';

export const CustomContent: FC = () => {
  const { register, setValue } = useFormContext();
  const depositWidth = useDepositWidth();
  const { tokenOptions, selectedTokenData } = useTokenOptions();

  const handleChange = useCallback(
    v => {
      setValue('json', v, { shouldValidate: true });
    },
    [setValue]
  );

  return (
    <div className={styles.root}>
      <div className={styles.address}>
        <InputWrapper
          fieldName="smartContractAddress"
          label="Smart Contract Address"
          fullWidth
        >
          <Input
            className={cn(styles.inputWrapper, styles.narrow)}
            type="text"
            min={0}
            placeholder="x.paras.near"
            isBorderless
            size="block"
            {...register('smartContractAddress')}
          />
        </InputWrapper>
      </div>

      <div className={styles.method}>
        <InputWrapper fieldName="methodName" label="Method Name" fullWidth>
          <Input
            className={cn(styles.inputWrapper, styles.narrow)}
            type="text"
            min={0}
            placeholder="nft_buy"
            isBorderless
            size="block"
            {...register('methodName')}
          />
        </InputWrapper>
      </div>

      <div className={styles.editor}>
        <InputWrapper fieldName="json" label="JSON" fullWidth>
          <AceEditor
            placeholder=""
            mode="json"
            className={styles.editorContent}
            theme="github"
            {...register('json')}
            onChange={handleChange}
            fontSize={14}
            width="99%"
            height="116px"
            showPrintMargin
            showGutter={false}
            highlightActiveLine={false}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: false,
              tabSize: 2,
            }}
          />
        </InputWrapper>
      </div>

      <div className={styles.gas}>
        <InputWrapper fieldName="actionsGas" label="TGas">
          <div className={styles.row}>
            <Input
              className={cn(styles.inputWrapper, styles.narrow)}
              type="number"
              min={MIN_GAS}
              step={1}
              max={MAX_GAS}
              placeholder={`${DEFAULT_PROPOSAL_GAS}`}
              isBorderless
              size="block"
              {...register('actionsGas')}
            />
          </div>
        </InputWrapper>
      </div>

      <div className={styles.deposit}>
        <div className={styles.row}>
          <InputWrapper fieldName="deposit" label="Deposit">
            <Input
              className={cn(styles.inputWrapper, styles.narrow)}
              inputStyles={{ width: `${depositWidth}ch`, paddingRight: 4 }}
              type="number"
              min={0}
              placeholder="00.0000"
              isBorderless
              size="block"
              {...register('deposit')}
            />
          </InputWrapper>
          <DropdownSelect
            className={styles.select}
            options={tokenOptions}
            label="&nbsp;"
            {...register('token')}
            onChange={v => {
              setValue('token', v, {
                shouldDirty: true,
              });
            }}
            defaultValue={selectedTokenData?.symbol ?? 'NEAR'}
          />
        </div>
      </div>
    </div>
  );
};
