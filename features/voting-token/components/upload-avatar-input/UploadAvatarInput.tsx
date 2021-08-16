import React, { FC } from 'react';

import { Button } from 'components/button/Button';

import Dropzone from './Dropzone';
import FileInput from './FileInput';

import styles from './upload-avatar-input.module.scss';

interface UploadAvatarInputProps {
  onChange: (val: string | ArrayBuffer | null) => void;
  selected: string | ArrayBuffer | null;
}

export const UploadAvatarInput: FC<UploadAvatarInputProps> = ({
  onChange,
  selected
}) => {
  const [selectedImage, setSelectedImage] = React.useState<
    string | ArrayBuffer
  >('');

  React.useEffect(() => {
    if (
      (!selectedImage && selected) ||
      (selectedImage !== selected && selected)
    ) {
      setSelectedImage(selected);
    }
  }, [selectedImage, selected]);

  const handleFilesAdded = React.useCallback(
    file => {
      if (!file) return;

      if (file.name) {
        // validate images type
        const allowedExt = ['png', 'jpg', 'jpeg', 'gif'];
        const idxDot = file.name.lastIndexOf('.') + 1;
        const extFile = file.name
          .substr(idxDot, file.name.length)
          .toLowerCase();

        if (!allowedExt.includes(extFile)) {
          return;
        }
      }

      if (file.size < 5 * 1e6) {
        const reader = new FileReader();

        reader.onload = e => {
          onChange(e.target?.result || null);
        };
        reader.readAsDataURL(file);
      }
    },
    [onChange]
  );

  return (
    <div className={styles.root}>
      <div className={styles.avatar}>
        {selectedImage ? (
          <div
            style={{ backgroundImage: `url(${selectedImage})` }}
            className={styles.selected}
          />
        ) : (
          <Dropzone onFileAdded={handleFilesAdded} />
        )}
      </div>
      <div className={styles.label}>Token icon</div>
      <div className={styles.button}>
        <FileInput onFileAdded={handleFilesAdded} selected={selectedImage} />
        {selectedImage && (
          <Button
            variant="tertiary"
            onClick={() => {
              onChange('');
              setSelectedImage('');
            }}
          >
            Remove icon
          </Button>
        )}
      </div>
    </div>
  );
};
