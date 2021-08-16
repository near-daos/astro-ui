import { GroupFormInput, GroupFormType } from 'features/groups/types';
import { Modal } from 'components/modal';
import styles from 'features/treasury/request-payout-popup/request-payout-popup.module.scss';
import { Icon, IconName } from 'components/Icon';
import React from 'react';
import { GroupForm } from 'features/groups/components/GroupForm';

export interface GroupPopupProps {
  initialValues: GroupFormInput;
  isOpen: boolean;
  onClose: () => void;
}

type HeaderType = {
  [color: number]: string;
};

type IconType = {
  [color: number]: IconName;
};

const icons: IconType = {
  [GroupFormType.ADD_TO_GROUP]: 'proposalAddMember' as IconName,
  [GroupFormType.CREATE_GROUP]: 'proposalCreateGroup' as IconName,
  [GroupFormType.REMOVE_FROM_GROUP]: 'proposalRemoveMember' as IconName
};

const headers: HeaderType = {
  [GroupFormType.CREATE_GROUP]: 'Create new group',
  [GroupFormType.REMOVE_FROM_GROUP]: 'Remove member from group',
  [GroupFormType.ADD_TO_GROUP]: 'Add member to group'
};

export const GroupPopup: React.FC<GroupPopupProps> = ({
  initialValues,
  isOpen,
  onClose
}) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleSubmit = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleCancel = () => {};
  const iconName = icons[initialValues.groupType];
  const header = headers[initialValues.groupType];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className={styles.header}>
        <Icon name={iconName} width={24} />
        <h2>{header}</h2>
      </header>

      <GroupForm
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        initialValues={initialValues}
      />
    </Modal>
  );
};
