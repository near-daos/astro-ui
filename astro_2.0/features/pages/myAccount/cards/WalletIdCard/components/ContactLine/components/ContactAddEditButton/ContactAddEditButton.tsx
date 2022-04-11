import React, { VFC } from 'react';
import { useTranslation } from 'next-i18next';

import { Button } from 'components/button/Button';

interface ContactAddEditButtonProps {
  isEdit: boolean;
  className?: string;
  onClick: () => void;
}

export const ContactAddEditButton: VFC<ContactAddEditButtonProps> = props => {
  const { isEdit, onClick, className } = props;

  const { t } = useTranslation('common');

  const label = isEdit ? 'myAccountPage.edit' : 'myAccountPage.add';

  return (
    <Button capitalize onClick={onClick} className={className}>
      {t(label)}
    </Button>
  );
};
