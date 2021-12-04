import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';
import AceEditor from 'react-ace';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';

import { Input } from 'components/inputs/input/Input';
import { DropdownSelect } from 'components/inputs/select/DropdownSelect';
import { Icon } from 'components/Icon';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

import styles from './CustomFunctionCallContent.module.scss';

ace.config.set(
  'basePath',
  'https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/'
);

const CustomFunctionCallContent: FC = () => {
  const { register, setValue, getValues, watch } = useFormContext();
  const { tokens } = useCustomTokensContext();
  const deposit = watch('deposit');
  let depositWidth;

  if (deposit.length <= 6) {
    depositWidth = 7;
  } else if (deposit.length >= 15) {
    depositWidth = 15;
  } else {
    depositWidth = deposit.length;
  }

  const tokenOptions = Object.values(tokens)
    .map(token => ({
      label: token.symbol,
      component: (
        <div className={styles.row}>
          <div className={styles.iconWrapper}>
            {token.symbol === 'NEAR' ? (
              <Icon name="tokenNearBig" />
            ) : (
              <div
                style={{
                  background: 'black',
                  backgroundImage: `url(${token.icon})`,
                }}
                className={styles.icon}
              />
            )}
          </div>
          <div className={styles.symbol}>{token.symbol}</div>
          <div className={styles.balance}>{token.balance}</div>
        </div>
      ),
    }))
    .filter(token => token.label === 'NEAR');

  watch('token');

  const selectedTokenData = tokens[getValues().selectedToken];

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

      <div className={styles.gas}>
        <InputWrapper fieldName="actionsGas" label="Gas">
          <div className={styles.row}>
            <Input
              className={cn(styles.inputWrapper, styles.narrow)}
              type="number"
              min={0.01}
              step={0.01}
              max={0.3}
              placeholder="0.15"
              isBorderless
              size="block"
              {...register('actionsGas')}
            />
            <div>NEAR</div>
          </div>
        </InputWrapper>
      </div>
    </div>
  );
};

export default CustomFunctionCallContent;
