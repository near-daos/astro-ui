import React, { FC } from 'react';

import { Button } from 'components/button/Button';

import styles from './file-input.module.scss';

interface FileInputProps {
  disabled?: boolean;
  onFileAdded: (file: File) => void;
  selected: string | ArrayBuffer;
}

const FileInput: FC<FileInputProps> = ({ disabled, onFileAdded, selected }) => {
  const fileInputRef = React.useRef({} as HTMLInputElement);
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

  return (
    <Button variant="secondary" className={styles.root} onClick={browseFiles}>
      <input
        accept="image/*"
        ref={fileInputRef}
        className={styles.input}
        type="file"
        onChange={handleFilesAdded}
      />
      {selected ? 'Change icon' : 'Upload avatar'}
    </Button>
  );
};

FileInput.defaultProps = {
  disabled: false
};

export default FileInput;
