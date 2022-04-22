import React, { FC } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';
import * as yup from 'yup';

import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { Input } from 'components/inputs/Input';
import { ImageUpload } from 'astro_2.0/features/CreateDao/components/ImageUpload';

import { getImgValidationError, validateImgSize } from 'utils/imageValidators';
import { useImageUpload } from 'astro_2.0/features/CreateDao/components/hooks';

import styles from './CreateTokenContent.module.scss';

const schema = yup.object().shape({
  value: yup.mixed().test('fileSize', getImgValidationError, validateImgSize),
});

async function validateAsset(data: { value: FileList }) {
  try {
    await schema.validate(data, {
      abortEarly: false,
    });

    return {
      values: { value: data.value },
      errors: null,
    };
  } catch (e) {
    return {
      values: null,
      errors: e.inner.reduce(
        (
          allErrors: Record<string, string>,
          currentError: { path: string; type?: string; message: string }
        ) => {
          return {
            ...allErrors,
            value: {
              type: currentError.type ?? 'validation',
              message: currentError.message,
            },
          };
        },
        {}
      ),
    };
  }
}

export const CreateTokenContent: FC = () => {
  const { register, setError, clearErrors } = useFormContext();
  const { uploadImage } = useImageUpload();

  return (
    <div className={styles.root}>
      <div className={styles.tokenName}>
        <InputWrapper fieldName="tokenName" label="Token Name">
          <Input
            className={cn(styles.inputWrapper, styles.narrow)}
            type="text"
            placeholder="Token Name"
            isBorderless
            size="block"
            {...register('tokenName')}
          />
        </InputWrapper>
      </div>
      <div className={styles.totalSupply}>
        <InputWrapper fieldName="totalSupply" label="Total Supply">
          <Input
            className={cn(styles.inputWrapper, styles.narrow)}
            type="text"
            placeholder="Total Supply"
            isBorderless
            size="block"
            {...register('totalSupply')}
          />
        </InputWrapper>
      </div>
      <div className={styles.tokenImage}>
        <InputWrapper fieldName="tokenImage" label="Token Image">
          <ImageUpload
            fieldName="tokenImage"
            className={styles.uploader}
            onSelect={async value => {
              const res = await validateAsset({ value });

              if (res.errors) {
                setError('tokenImage', res.errors.value);
              } else if (res.values) {
                clearErrors('tokenImage');

                await uploadImage(value[0]);
              }
            }}
          />
        </InputWrapper>
      </div>
    </div>
  );
};
