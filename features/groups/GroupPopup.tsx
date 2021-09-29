import { Icon, IconName } from 'components/Icon';

import { Modal } from 'components/modal';
import { GroupForm } from 'features/groups/components/GroupForm';

import {
  GroupFormInput,
  GroupFormType,
  IGroupForm
} from 'features/groups/types';

import styles from 'features/treasury/request-payout-popup/request-payout-popup.module.scss';
import { useDao } from 'hooks/useDao';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import { SputnikService } from 'services/SputnikService';
import {
  getAddMemberProposal,
  getChangePolicyProposal,
  getRemoveMemberProposal
} from './helpers';

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
  const { groupType } = initialValues;

  const router = useRouter();
  const daoId = router.query.dao as string;
  const currentDao = useDao(daoId);

  const handleSubmit = useCallback(
    (data: IGroupForm) => {
      let proposalData;

      if (currentDao) {
        if (groupType === GroupFormType.ADD_TO_GROUP) {
          proposalData = getAddMemberProposal(data, currentDao);
        } else if (groupType === GroupFormType.REMOVE_FROM_GROUP) {
          proposalData = getRemoveMemberProposal(data, currentDao);
        } else if (groupType === GroupFormType.CREATE_GROUP) {
          proposalData = getChangePolicyProposal(data, currentDao);
        }

        if (proposalData) {
          SputnikService.createProposal(proposalData);
        } else {
          console.error('No proposal data to create proposal');
        }
      } else {
        console.error(
          'GroupPopup: There is no selected daoId. Can not create proposal.'
        );
      }

      onClose();
    },
    [groupType, onClose, currentDao]
  );

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

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
