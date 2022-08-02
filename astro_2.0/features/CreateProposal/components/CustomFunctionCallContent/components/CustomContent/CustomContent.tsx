import React, { FC, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';
import AceEditor from 'react-ace';
import { useAsyncFn, useMount } from 'react-use';

import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { DropdownSelect } from 'components/inputs/selects/DropdownSelect';
import { DebouncedInput, Input } from 'components/inputs/Input';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';

import {
  DEFAULT_PROPOSAL_GAS,
  MAX_GAS,
  MIN_GAS,
} from 'services/sputnik/constants';

import {
  useDepositWidth,
  useTokenOptions,
} from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/hooks';

import { useWalletContext } from 'context/WalletContext';

import styles from './CustomContent.module.scss';

export const CustomContent: FC = () => {
  const { nearService } = useWalletContext();
  const { register, setValue, getValues, watch } = useFormContext();
  const depositWidth = useDepositWidth();
  const methodName = watch('methodName');
  const { tokenOptions, selectedTokenData } = useTokenOptions();
  const [availableMethods, setAvailableMethods] = useState<
    | {
        value: string;
        label: string;
      }[]
    | null
  >(null);

  const handleChange = useCallback(
    v => {
      setValue('json', v, { shouldValidate: true });
    },
    [setValue]
  );
  const { json } = getValues();

  useMount(() => {
    // Setting default value on form hook doesn't work with Ace so we update value manually
    setValue('json', json, { shouldValidate: true });
  });

  const [{ loading }, handleSmartContractAddressChange] = useAsyncFn(
    async val => {
      setValue('methodName', '', { shouldValidate: true });
      setValue('smartContractAddress', val, { shouldValidate: true });

      if (!nearService || !val) {
        setAvailableMethods(null);

        return;
      }

      const methods = await nearService.getSmartContractMethods(val);

      if (methods) {
        const options = methods.map(item => ({ value: item, label: item }));

        setAvailableMethods(options);

        return;
      }

      setAvailableMethods(null);
    },
    [nearService, setValue]
  );

  function renderMethods() {
    if (loading) {
      return (
        <LoadingIndicator
          className={styles.loader}
          label="Looking for method names..."
        />
      );
    }

    if (availableMethods) {
      return (
        <DropdownSelect
          className={styles.methodSelect}
          options={availableMethods}
          {...register('methodName')}
          onChange={v => {
            setValue('methodName', v, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          defaultValue={methodName}
          placeholder="Select contract method"
        />
      );
    }

    return (
      <Input
        className={cn(styles.inputWrapper, styles.narrow)}
        type="text"
        min={0}
        placeholder="nft_buy"
        isBorderless
        size="block"
        {...register('methodName')}
      />
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.address}>
        <InputWrapper
          fieldName="smartContractAddress"
          label="Smart Contract Address"
          fullWidth
        >
          <DebouncedInput
            className={cn(styles.inputWrapper, styles.narrow)}
            placeholder="x.paras.near"
            isBorderless
            size="block"
            {...register('smartContractAddress')}
            onValueChange={handleSmartContractAddressChange}
          />
        </InputWrapper>
      </div>

      <div className={styles.method}>
        <InputWrapper fieldName="methodName" label="Method Name" fullWidth>
          {renderMethods()}
        </InputWrapper>
      </div>

      <div className={styles.editor}>
        <InputWrapper fieldName="json" label="JSON" fullWidth>
          <AceEditor
            key={getValues().functionCallType}
            placeholder=""
            mode="json"
            className={styles.editorContent}
            theme="github"
            {...register('json')}
            onChange={handleChange}
            defaultValue={json}
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
