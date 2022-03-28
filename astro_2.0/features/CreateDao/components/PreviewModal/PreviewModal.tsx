import React, { FC } from 'react';
import { Modal } from 'components/modal';
import { FlagPreview } from 'astro_2.0/features/CreateDao/components/FlagPreview/FlagPreview';

export interface PreviewModal {
  isOpen: boolean;
  onClose: () => void;
  cover: string;
  logo: string;
}

export const PreviewModal: FC<PreviewModal> = ({
  isOpen,
  onClose,
  cover,
  logo,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <FlagPreview coverFile={cover} logoFile={logo} />
    </Modal>
  );
};
