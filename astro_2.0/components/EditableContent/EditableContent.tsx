import React, { FC } from 'react';
import cn from 'classnames';

import 'react-quill/dist/quill.snow.css';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { Hashtag } from 'types/draftProposal';

import { EditTitle } from './EditTitle';
import { EditHashtags } from './EditHashtags';

import styles from './EditableContent.module.scss';

const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false;

const icons =
  typeof window === 'object' ? ReactQuill.Quill.import('ui/icons') : {};

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
    </div>
  );
};

const formats = ['list', 'bold', 'italic', 'image'];

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
}) => {
  const modules = {
    toolbar: {
      container: `#${id}`,
    },
  };

  const send = () => {
    if (handleSend) {
      handleSend(html);
    }
  };

  return (
    <div className={styles.createComment}>
      {renderCustomToolbar(id)}
      {setTitle ? (
        <EditTitle
          title={title}
          placeholder={titlePlaceholder}
          setTitle={setTitle}
        />
      ) : null}
      {setHashtags && hashtags ? (
        <EditHashtags hashtags={hashtags} setHashtags={setHashtags} />
      ) : null}
      <ReactQuill
        onChange={setHTML}
        value={html}
        className={styles.textField}
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
