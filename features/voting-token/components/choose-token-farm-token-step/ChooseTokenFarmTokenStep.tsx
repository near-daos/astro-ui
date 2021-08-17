import React, { FC, useState } from 'react';
import cn from 'classnames';

import { useWizardContext } from 'features/voting-token/components/voting-token-wizard/helpers';
import { Button } from 'components/button/Button';
import { Select } from 'components/select/Select';

import styles from './choose-token-farm-token-step.module.scss';

const options = [
  {
    label: 'GOOSE',
    value: 'GOOSE'
  },
  {
    label: 'MOON',
    value: 'MOON'
  }
];

export const ChooseTokenFarmTokenStep: FC = () => {
  const { handleCancel, handleNext } = useWizardContext();
  const [name, setName] = useState<string | undefined>('');

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h2>Choose a Token Farm token for voting</h2>
      </header>
      <div className={styles.row}>
        <span>
          <Select
            className={cn(styles.token)}
            placeholder=""
            size="block"
            defaultValue={name}
            label="Token name"
            options={options}
            onChange={v => setName(v)}
          />
        </span>
        <span>.tkn.near</span>
      </div>
      <div className={styles.footer}>
        <Button
          variant="secondary"
          onClick={handleCancel}
          size="small"
          className={styles.mr8}
        >
          Cancel
        </Button>
        &nbsp;&nbsp;
        <Button
          disabled={!name}
          variant="primary"
          onClick={() =>
            handleNext({ tokenName: name, tokenSymbol: `${name}.tkn.near` })
          }
          size="small"
          className={styles.ml8}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
