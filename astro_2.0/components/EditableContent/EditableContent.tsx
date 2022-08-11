import React, { FC, useMemo, useRef } from 'react';
import cn from 'classnames';
import { FieldError } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import 'react-quill/dist/quill.snow.css';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { useImageUpload } from 'astro_2.0/features/CreateDao/components/hooks';
import { getAwsImageUrl } from 'services/sputnik/mappers/utils/getAwsImageUrl';

import styles from './EditableContent.module.scss';

const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false;

const icons =
  typeof window === 'object' && ReactQuill?.Quill
    ? ReactQuill.Quill.import('ui/icons')
    : {};

icons.list = null;
icons.bold = null;
icons.italic = null;
icons.bold = null;

const renderCustomToolbar = (id: string) => {
  return (
    <div id={id} className={styles.toolbar}>
      <button type="button" className={cn('ql-list', styles.button)}>
        <Icon name="toolbarEditorList" />
      </button>
      <button type="button" className={cn('ql-bold', styles.button)}>
        <Icon name="toolbarEditorBold" />
      </button>
      <button type="button" className={cn('ql-italic', styles.button)}>
        <Icon name="toolbarEditorItalic" />
      </button>
      <button type="button" className={cn('ql-image', styles.button)}>
        <Icon name="toolbarEditorImage" />
      </button>
      <button type="button" className={cn('ql-code-block', styles.button)}>
        <Icon name="commentBlock" />
      </button>
    </div>
  );
};

const formats = ['list', 'bold', 'italic', 'image', 'code-block'];

type EditableContentErrors = {
  title?: FieldError;
  description?: FieldError;
};

type EditableContentProps = {
  id?: string;
  placeholder?: string;
  titlePlaceholder?: string;
  html: string;
  setHTML: (html: string) => void;
  title?: string;
  setTitle?: (value: string) => void;
  handleSend?: (html: string) => void;
  handleCancel?: () => void;
  className?: string;
  errors?: EditableContentErrors;
};

export const EditableContent: FC<EditableContentProps> = ({
  id = 'toolbar',
  html,
  setHTML,
  placeholder,
  handleSend,
  handleCancel,
  title,
  setTitle,
  titlePlaceholder,
  className,
  errors,
}) => {
  // eslint-disable-next-line
  const quillRef = useRef<any>();
  const { uploadImage } = useImageUpload();
  const { t } = useTranslation();

  const modules = useMemo(
    () => ({
      toolbar: {
        container: `#${id}`,
        handlers: {
          image() {
            const input = document.createElement('input');

            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = async () => {
              const file: File | null = input?.files?.length
                ? input?.files[0]
                : null;

              if (!file || !quillRef.current) {
                return;
              }

              const formData = new FormData();

              formData.append('image', file);

              const image = await uploadImage(file);
              const range = quillRef.current.getEditorSelection();

              quillRef.current
                .getEditor()
                .insertEmbed(range.index, 'image', getAwsImageUrl(image));
            };
          },
        },
        syntax: true,
      },
    }),
    [id, uploadImage]
  );

  const send = () => {
    if (handleSend) {
      handleSend(html);
    }

    if (handleCancel) {
      handleCancel();
    }
  };

  return (
    <div className={cn(styles.editable, className)}>
      {renderCustomToolbar(id)}
      {setTitle ? (
        <div
          className={cn(styles.titleEdit, {
            [styles.titleError]: errors?.title?.message,
          })}
        >
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={styles.titleInput}
            type="text"
            placeholder={titlePlaceholder}
          />
        </div>
      ) : null}
      <ReactQuill
        ref={quillRef}
        onChange={setHTML}
        value={html}
        className={cn(styles.textField, {
          [styles.error]: errors?.description?.message,
        })}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
      />
      {handleSend ? (
        <div className={styles.bottom}>
          <Button
            capitalize
            variant="secondary"
            size="small"
            onClick={handleCancel}
          >
            {t('drafts.editableContent.cancelButton')}
          </Button>
          <Button
            disabled={html === '' || html === '<p><br></p>'}
            capitalize
            size="small"
            className={styles.send}
            onClick={send}
          >
            {t('drafts.editableContent.sendButton')}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
