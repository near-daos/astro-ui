import React, { FC, ReactNode, useCallback, useState } from 'react';
import cn from 'classnames';
import AceEditor from 'react-ace';
import { useFormContext } from 'react-hook-form';
import { useMount } from 'react-use';

import { Toggle } from 'components/inputs/Toggle';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { Input } from 'components/inputs/Input';
import { DropdownSelect } from 'components/inputs/selects/DropdownSelect';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { useModal } from 'components/modal';
import { ConfirmModal } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard/ConfirmModal';

import {
  DEFAULT_PROPOSAL_GAS,
  MAX_GAS,
  MIN_GAS,
} from 'services/sputnik/constants';

import {
  useDepositWidth,
  useTokenOptions,
} from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/hooks';

import styles from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard/CustomFcTemplateCard.module.scss';

interface Props {
  onReset: () => void;
  onDelete: () => void;
  optionalControl?: ReactNode;
}

export const CardContent: FC<Props> = ({
  onReset,
  onDelete,
  optionalControl,
}) => {
  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { isDirty, errors },
  } = useFormContext();

  const isValid = Object.keys(errors).length === 0;
  const [expanded, setExpanded] = useState(false);
  const [showModal] = useModal(ConfirmModal);
  const depositWidth = useDepositWidth('deposit');
  const { tokenOptions, selectedTokenData } = useTokenOptions();

  const handleDelete = useCallback(async () => {
    const res = await showModal();

    if (res.length) {
      onDelete();
    }
  }, [onDelete, showModal]);

  const handleChange = useCallback(
    v => {
      setValue('json', v, { shouldValidate: true, shouldDirty: true });
    },
    [setValue]
  );

  const isActive = watch('isActive');
  const { json } = getValues();

  useMount(() => {
    // Setting default value on form hook doesn't work with Ace so we update value manually
    setValue('json', json, { shouldValidate: true });
  });

  return (
    <>
      {isDirty ? (
        <div className={cn(styles.controls)}>
          <Button
            capitalize
            variant="tertiary"
            size="small"
            onClick={onReset}
            className={styles.cancel}
          >
            Cancel
          </Button>
          <Button
            disabled={!isValid}
            capitalize
            size="small"
            type="submit"
            className={styles.save}
          >
            Save
          </Button>
        </div>
      ) : (
        <div className={styles.controls}>
          <Button
            variant="tertiary"
            className={styles.delete}
            capitalize
            size="small"
            onClick={handleDelete}
          >
            <Icon name="buttonDelete" className={styles.icon} />
            Delete
          </Button>
          {optionalControl}
        </div>
      )}

      <Toggle
        key={isActive}
        label="Enable template"
        defaultChecked={isActive}
        {...register('isActive')}
        onChange={() => {
          setValue('isActive', !isActive, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
        className={styles.toggle}
      />

      <div className={styles.name}>
        <InputWrapper fieldName="name" label="Template Name" fullWidth>
          <Input
            className={cn(
              styles.inputWrapper,
              styles.narrow,
              styles.templateName
            )}
            type="text"
            isBorderless
            size="block"
            {...register('name')}
          />
        </InputWrapper>
      </div>

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

      <div className={cn(styles.editor, { [styles.expanded]: expanded })}>
        <InputWrapper
          fieldName="json"
          label="JSON"
          fullWidth
          className={cn(styles.editorLabel, {
            [styles.expanded]: expanded,
          })}
        >
          <div
            className={cn(styles.editorWrapper, {
              [styles.expanded]: expanded,
            })}
          >
            <AceEditor
              placeholder=""
              mode="json"
              className={styles.editorContent}
              theme="github"
              {...register('json')}
              onChange={handleChange}
              defaultValue={json}
              fontSize={14}
              width={expanded ? '100%' : '0'}
              height="200px"
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
          </div>
          <Button
            size={expanded ? 'block' : 'small'}
            variant={expanded ? 'transparent' : 'secondary'}
            className={cn({
              [styles.editorWrapperControlCollapsed]: !expanded,
              [styles.editorWrapperControl]: expanded,
            })}
            onClick={() => setExpanded(!expanded)}
            capitalize
          >
            <Icon
              name={expanded ? 'buttonArrowUp' : 'buttonEdit'}
              className={styles.icon}
            />
            {!expanded && 'Edit'}
          </Button>
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
              inputStyles={{
                width: `${depositWidth}ch`,
                paddingRight: 4,
              }}
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
    </>
  );
};
