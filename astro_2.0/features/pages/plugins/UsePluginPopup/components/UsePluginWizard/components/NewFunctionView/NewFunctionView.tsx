import ace from 'ace-builds';
import { nanoid } from 'nanoid';
import AceEditor from 'react-ace';
import React, { useState, useCallback, VFC } from 'react';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';

import { Button } from 'components/button/Button';
import { useWizardContext } from 'astro_2.0/features/pages/plugins/UsePluginPopup/components/UsePluginWizard/helpers';

import styles from './NewFunctionView.module.scss';

ace.config.set(
  'basePath',
  'https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/'
);

export const NewFunctionView: VFC = () => {
  const [code, setCode] = useState('');
  const { setData, onClose } = useWizardContext();

  const handleChange = useCallback(v => {
    setCode(v);
  }, []);

  const handleSubmit = useCallback(() => {
    // todo - validate code

    setData({
      nearFunction: {
        id: nanoid(),
        functionName: '',
        code,
      },
    });
  }, [code, setData]);

  return (
    <div className={styles.root}>
      <div className={styles.title}>Recipe JSON.</div>
      <div className={styles.desc}>
        Recipes let a DAO call any NEAR smart contract function
      </div>
      <div className={styles.label}>Code</div>
      <div className={styles.wrapper}>
        <AceEditor
          placeholder=""
          mode="json"
          className={styles.editor}
          theme="github"
          name="editor"
          onChange={handleChange}
          fontSize={14}
          width="100%"
          height="200"
          showPrintMargin
          showGutter={false}
          highlightActiveLine={false}
          value={code}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: false,
            tabSize: 2,
          }}
        />
      </div>
      <a
        href="http://example.com"
        className={styles.link}
        target="_blank"
        rel="noreferrer"
      >
        Learn more about NEAR smart contract recipes
      </a>
      <div className={styles.footer}>
        <Button
          variant="secondary"
          onClick={onClose}
          size="small"
          className={styles.mr8}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          size="small"
          className={styles.ml8}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
