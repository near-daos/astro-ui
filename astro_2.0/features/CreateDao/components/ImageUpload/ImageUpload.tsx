import uniqid from 'uniqid';
import classNames from 'classnames';
import { useMount, useToggle } from 'react-use';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import React, {
  PropsWithRef,
  ReactNode,
  RefObject,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { DaoImageType } from 'astro_2.0/features/CreateDao/components/types';

import { Icon } from 'components/Icon';
import { InputFormWrapper } from 'components/inputs/InputFormWrapper';

import { getImageFromImageFileList } from 'utils/getImageFromImageFileList';

import styles from './ImageUpload.module.scss';

export interface ImageUploadProps<T extends Element> {
  fieldName: DaoImageType;
  errorElRef?: RefObject<T>;
  showPreview?: boolean;
  control?: ReactNode;
  className?: string;
  onSelect?: (value: FileList, isDrop?: boolean) => void;
}

export const ImageUpload = <T extends Element>(
  props: PropsWithRef<ImageUploadProps<T>>
): JSX.Element => {
  const {
    fieldName,
    errorElRef,
    control,
    className,
    onSelect,
    showPreview = true,
  } = props;

  const { t } = useTranslation();

  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext();

  const imageFileList = watch(fieldName);
  const isImageUploaded = imageFileList?.length;

  const [id, setId] = useState('');

  useMount(() => {
    setId(uniqid());
  });

  const { onChange, ...inputProps } = register(fieldName);

  const [show, toggleShow] = useToggle(false);
  const uploadText = isImageUploaded
    ? t('common.clickToChangeImage')
    : t('common.clickToUploadImage');

  const previewStyles = useMemo(() => {
    return {
      backgroundImage: `url(${getImageFromImageFileList(imageFileList)})`,
    };
  }, [imageFileList]);

  const handleDragOver = useCallback(e => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const handleChange = useCallback(
    e => {
      e.stopPropagation();
      e.preventDefault();

      onChange(e);

      if (onSelect && e.target.files) {
        onSelect(e.target.files);
      }
    },
    [onChange, onSelect]
  );

  const handleDrop = useCallback(
    e => {
      e.stopPropagation();
      e.preventDefault();

      if (onSelect && e.dataTransfer.files) {
        onSelect(e.dataTransfer.files, true);
      }
    },
    [onSelect]
  );

  function renderInput() {
    const inputEl = (
      <input
        id={id}
        type="file"
        {...inputProps}
        onChange={handleChange}
        className={styles.uploadInput}
        accept="image/gif, image/jpeg, image/png"
      />
    );

    if (errorElRef?.current) {
      return (
        <InputFormWrapper
          errors={errors}
          errorElRef={errorElRef}
          component={inputEl}
        />
      );
    }

    return inputEl;
  }

  return (
    <div
      className={classNames(styles.root, className)}
      onMouseEnter={toggleShow}
      onMouseLeave={toggleShow}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {renderInput()}
      {showPreview && (
        <div
          className={classNames(styles.image, {
            [styles.logo]: fieldName === 'flagLogo',
          })}
          style={previewStyles}
        />
      )}

      <label htmlFor={id}>
        {control || (
          <div
            className={classNames(styles.overlay, {
              [styles.clear]: !isImageUploaded,
              [styles.show]: show,
            })}
          >
            <Icon name="upload" width={24} />
            {uploadText}
          </div>
        )}
      </label>
    </div>
  );
};
