import React, { FC, useCallback } from 'react';
import { useMount, useWindowSize } from 'react-use';
import AceEditor from 'react-ace';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';

import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { Modal } from 'components/modal';
import { Button } from 'components/button/Button';

import styles from './CustomEdit.module.scss';

ace.config.set(
  'basePath',
  'https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/'
);

type CustomEdit = {
  json: string;
};

export interface CustomEditModalProps {
  isOpen: boolean;
  onClose: (val?: CustomEdit) => void;
  json: string;
}

export const CustomEditModal: FC<CustomEditModalProps> = ({
  isOpen,
  onClose,
  json,
}) => {
  const { height } = useWindowSize();

  const methods = useForm<CustomEdit>({
    mode: 'all',
    resolver: yupResolver(
      yup.object().shape({
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
      })
    ),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = methods;

  const handleChange = useCallback(
    v => {
      setValue('json', v, { shouldValidate: true });
    },
    [setValue]
  );

  const onSubmit = (data: CustomEdit) => {
    onClose(data);
  };

  useMount(() => {
    // Setting default value on form hook doesn't work with Ace so we update value manually
    setValue('json', json, { shouldValidate: true });
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="auto">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
          <div className={styles.title}>Custom edit</div>
          <InputWrapper fieldName="json" label="JSON" fullWidth>
            <AceEditor
              placeholder=""
              mode="json"
              className={styles.editorContent}
              theme="github"
              {...register('json')}
              defaultValue={json}
              onChange={handleChange}
              fontSize={14}
              width="99%"
              height={`${height / 2}px`}
              showPrintMargin={false}
              // showGutter={false}
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

          <div className={styles.footer}>
            <Button
              variant="secondary"
              onClick={() => onClose()}
              className={styles.customEditButton}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!isValid}
              className={styles.customEditButton}
            >
              Create New DAO
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
