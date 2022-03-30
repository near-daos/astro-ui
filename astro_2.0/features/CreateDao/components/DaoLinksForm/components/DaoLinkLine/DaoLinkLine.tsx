import React, { useCallback, useRef, VFC } from 'react';
import { useFormContext } from 'react-hook-form';

import { getSocialLinkIcon } from 'utils/getSocialLinkIcon';

import { Icon } from 'components/Icon';
import { Input } from 'components/inputs/Input';
import { IconButton } from 'components/button/IconButton';
import { InputFormWrapper } from 'components/inputs/InputFormWrapper';

import styles from './DaoLinkLine.module.scss';

interface DaoLinkLineProps {
  index: number;
  removeLink: (index: number) => void;
}

export const DaoLinkLine: VFC<DaoLinkLineProps> = ({ index, removeLink }) => {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext();

  const errorEl = useRef<HTMLDivElement>(null);

  const removeWebsiteLink = useCallback(() => {
    removeLink(index);
  }, [index, removeLink]);

  return (
    <div className={styles.root}>
      <div className={styles.link}>
        <Icon
          className={styles.socialIcon}
          name={getSocialLinkIcon(getValues(`websites.${index}` as const))}
          width={24}
        />
        <InputFormWrapper
          errors={errors}
          errorElRef={errorEl}
          className={styles.validationWrapper}
          component={
            <Input
              key={`websites.${index}` as const}
              placeholder="https://"
              {...register(`websites.${index}` as const, {
                shouldUnregister: true,
              })}
              size="block"
            />
          }
        />
        <IconButton
          className={styles.deleteBtn}
          icon="buttonDelete"
          onClick={removeWebsiteLink}
          size="medium"
        />
      </div>
      <div ref={errorEl} className={styles.errorEl} />
    </div>
  );
};
