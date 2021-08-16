import React, { FC } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import styles from './dropzone.module.scss';

interface DropzoneProps {
  disabled?: boolean;
  onFileAdded: (file: File) => void;
}

const Dropzone: FC<DropzoneProps> = ({ disabled, onFileAdded }) => {
  const fileInputRef = React.useRef({} as HTMLInputElement);
  const [highlighted, setHighlighted] = React.useState(false);

  const handleFilesAdded = React.useCallback(
    e => {
      if (disabled) return;

      const { files } = e.target;

      if (onFileAdded) {
        const file = files[0];

        onFileAdded(file);
      }
    },
    [onFileAdded, disabled]
  );

  const browseFiles = React.useCallback(() => {
    if (disabled) return;

    fileInputRef.current?.click();
  }, [disabled]);

  const onDragOver = React.useCallback(
    e => {
      e.preventDefault();

      if (disabled) return;

      setHighlighted(true);
    },
    [disabled]
  );

  const onDragLeave = React.useCallback(() => {
    setHighlighted(false);
  }, []);

  const onDrop = React.useCallback(
    e => {
      e.preventDefault();

      if (disabled) return;

      const { files } = e.dataTransfer;

      if (onFileAdded) {
        onFileAdded(files[0]);
      }

      setHighlighted(false);
    },
    [onFileAdded, disabled]
  );

  return (
    <div
      className={cn(styles.root, {
        [styles.highlighted]: highlighted
      })}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        accept="image/*"
        ref={fileInputRef}
        className={styles.input}
        type="file"
        onChange={handleFilesAdded}
      />
      <Button variant="tertiary" className={styles.btn} onClick={browseFiles}>
        <Icon name="buttonAdd" className={styles.icon} />
      </Button>
    </div>
  );
};

Dropzone.defaultProps = {
  disabled: false,
  onFileAdded: undefined
};

export default Dropzone;
