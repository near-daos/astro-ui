import React, { FC } from 'react';
import cn from 'classnames';
import { FieldError } from 'react-hook-form';

import 'react-quill/dist/quill.snow.css';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { Hashtag } from 'types/draftProposal';

import { EditHashtags } from './EditHashtags';

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
  hashtags?: FieldError;
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
  hashtags?: Hashtag[];
  setHashtags?: (hashtags: Hashtag[]) => void;
  handleSend?: (html: string) => void;
  className?: string;
  errors?: EditableContentErrors;
};

export const EditableContent: FC<EditableContentProps> = ({
  id = 'toolbar',
  html,
  setHTML,
  placeholder = 'Write a comment...',
  handleSend,
  title,
  setTitle,
  hashtags,
  setHashtags,
  titlePlaceholder,
  className,
  errors,
}) => {
  const modules = {
    toolbar: {
      container: `#${id}`,
    },
    syntax: true,
  };

  const send = () => {
    if (handleSend) {
      handleSend(html);
    }
  };

  return (
    <div className={cn(styles.createComment, className)}>
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
      {setHashtags && hashtags ? (
        <EditHashtags
          hashtags={hashtags}
          setHashtags={setHashtags}
          error={errors?.hashtags?.message}
        />
      ) : null}
      <ReactQuill
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
            disabled={html === '' || html === '<p><br></p>'}
            capitalize
            size="small"
            className={styles.send}
            onClick={send}
          >
            Send
          </Button>
        </div>
      ) : null}
    </div>
  );
};
