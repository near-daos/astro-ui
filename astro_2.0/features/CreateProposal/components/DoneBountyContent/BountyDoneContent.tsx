import React, { FC } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';

import { Input } from 'components/inputs/Input';

import styles from './BountyDoneContent.module.scss';

export const BountyDoneContent: FC = () => {
  const { register } = useFormContext();

  return (
    <div className={styles.root}>
      <Input
        label="Target"
        className={cn(styles.inputWrapper, styles.wide)}
        placeholder="user.near"
        isBorderless
        size="block"
        {...register('target')}
        disabled
      />
    </div>
  );
};
