// TODO requires localisation
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import React, { KeyboardEvent, useCallback, useEffect, useState } from 'react';

import { DaoVotePolicy, TGroup } from 'types/dao';

import { VALID_WEBSITE_NAME_REGEXP } from 'constants/regexp';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { onPressEnterBtn } from 'utils/handlePressEnterBtn';

import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { ConfirmResetModal } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/components/ManageGroups/components/ConfirmResetModal';
import { ConfirmDeleteModal } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/components/ManageGroups/components/ConfirmDeleteModal';
import { GroupQuorum } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/components/ManageGroups/components/GroupQuorum';
import { validateUserAccount } from 'astro_2.0/features/CreateProposal/helpers';

import { useWalletContext } from 'context/WalletContext';

import { Badge } from 'components/Badge';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { useModal } from 'components/modal';

import { useProcessMembersPaste } from './hooks/useProcessMembersPaste';

import styles from './EditGroup.module.scss';

type Props = {
  group: TLocalGroup;
  onChange: (group: TLocalGroup) => void;
  onReset: () => void;
  onDelete: () => void;
  groupsNames: string[];
  disabled: boolean;
};

type TLocalGroup = Omit<TGroup, 'votePolicy'> & {
  hasChanges: boolean;
  isCreated: boolean;
  votePolicy: DaoVotePolicy;
};

type TAllowedFeatures = {
  canDelete: boolean;
};

const BAN_SLUGS = ['council', 'councils'];

export const EditGroup: React.FC<Props> = ({
  group,
  onChange,
  onReset,
  onDelete,
  groupsNames,
  disabled,
}) => {
  const { t } = useTranslation();
  const { nearService } = useWalletContext();

  const [addMemberName, setAddMemberName] = useState('');
  const [isNewMemberNameValid, setIsNewMemberNameValid] = useState(true);

  const [searchMemberValue, setSearchMemberValue] = useState('');
  const [showSearchResult, setShowSearchResult] = useState(false);

  const [newGroupName, setNewGroupName] = useState(group.name);
  const [showEditGroupName, setShowEditGroupName] = useState(
    group.isCreated && group.name === ''
  );

  const [showConfirmDeleteModal] = useModal(ConfirmDeleteModal, {
    initialData: {
      groupName: group.name,
      callback: onDelete,
    },
  });

  const [showConfirmResetModal] = useModal(ConfirmResetModal, {
    initialData: {
      callback: onReset,
    },
  });

  useEffect(() => {
    setShowEditGroupName(false);

    setNewGroupName(group.name);
  }, [group.name, group.slug, group.votePolicy.quorum]);

  useEffect(() => {
    if (group.isCreated && group.name === '') {
      setShowEditGroupName(true);
      setNewGroupName('');
    }
  }, [group, group.isCreated, group.name]);

  const handleSearch = () => {
    setShowSearchResult(true);
  };

  const handleSearchInputChanges = (text: string) => {
    setSearchMemberValue(text);

    setShowSearchResult(false);
  };

  const handleNewGroupName = () => {
    if (newGroupName.trim() === '') {
      return;
    }

    if (!newGroupName.match(VALID_WEBSITE_NAME_REGEXP)) {
      showNotification({
        type: NOTIFICATION_TYPES.WARNING,
        description: t('manageGroups.groupIncorrectCharactersError'),
        lifetime: 10000,
      });

      return;
    }

    setShowEditGroupName(false);

    onChange({
      ...group,
      name:
        newGroupName.trim().toLowerCase() === 'council'
          ? 'council'
          : newGroupName.trim(),
    });
  };

  const handleUpdateQuorum = (val: number) => {
    onChange({
      ...group,
      votePolicy: { ...group.votePolicy, quorum: val.toString() },
    });
  };

  const addGroupMembers = useCallback(
    (members: string[]) => {
      const newMembers = new Set([...group.members, ...members]);

      onChange({
        ...group,
        members: [...newMembers],
      });
    },
    [group, onChange]
  );

  const handleAddGroupMember = async () => {
    if (isNewMemberNameValid) {
      addGroupMembers([addMemberName.trim()]);

      setAddMemberName('');
    }
  };

  const { processing, onPasteMembers } = useProcessMembersPaste({
    setAddMemberName,
    addGroupMembers,
  });

  const handleRemoveGroupMember = (name: string) => {
    onChange({
      ...group,
      members: group.members.filter(member => member !== name),
    });

    setAddMemberName('');
  };

  if (!group) {
    return null;
  }

  const { members } = group;

  const filteredMembers = group.members.filter(member =>
    member.toLowerCase().includes(searchMemberValue)
  );

  const allowedFeatures: TAllowedFeatures = {
    canDelete:
      !BAN_SLUGS.includes(group.slug.toLowerCase()) && !group.isCreated,
  };

  function onMemberInputButtonPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleAddGroupMember();
    }
  }

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        {showEditGroupName ? (
          <div className={styles.headerEditView}>
            <input
              type="text"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="New group"
              onKeyDown={e => onPressEnterBtn(e, handleNewGroupName)}
            />

            <Button
              variant="transparent"
              className={cn(styles.headerEditViewSubmit)}
              disabled={groupsNames.includes(newGroupName.trim().toLowerCase())}
              onClick={handleNewGroupName}
            >
              <Icon name="check" />
            </Button>
          </div>
        ) : (
          <div className={styles.headerContent}>
            <p className={styles.headerText}>{group.name}</p>

            <Button
              variant="transparent"
              disabled={disabled}
              className={styles.headerEdit}
              onClick={() => {
                setNewGroupName(group.name);

                setShowEditGroupName(true);
              }}
            >
              <Icon name="pencil" />
            </Button>
          </div>
        )}

        <div className={styles.headerControl}>
          {group.hasChanges && (
            <Button
              variant="transparent"
              className={styles.headerReset}
              size="small"
              onClick={() => showConfirmResetModal()}
            >
              <Icon name="refresh" />
              Reset
            </Button>
          )}
          {allowedFeatures.canDelete && (
            <Button
              disabled={disabled}
              variant="tertiary"
              className={styles.headerDelete}
              size="small"
              onClick={() => showConfirmDeleteModal()}
            >
              <Icon name="buttonDeletePressed" />
              Delete group
            </Button>
          )}
        </div>
      </div>

      <div className={styles.manageBlock}>
        <div className={styles.members}>
          <div className={styles.memberHead}>
            <Icon name="groups" className={styles.membersHeadIcon} />

            <h6 className={styles.membersHeadTitle}>Members</h6>

            <Badge size="small" variant="lightgray">
              {group.members.length}
            </Badge>

            <div className={styles.memberSearch}>
              <Icon name="buttonSearch" className={styles.memberSearchIcon} />

              <input
                type="text"
                className={cn(styles.memberSearchInput, {
                  [styles.memberSearchInputShort]:
                    searchMemberValue.trim().length > 0,
                })}
                value={searchMemberValue}
                onChange={e => handleSearchInputChanges(e.target.value)}
                placeholder="Search by member"
                onKeyDown={e => onPressEnterBtn(e, handleSearch)}
              />

              <Icon
                name="check"
                onClick={handleSearch}
                className={cn(styles.memberSearchDone, {
                  [styles.iconVisible]: searchMemberValue.trim().length > 0,
                })}
              />
            </div>
          </div>

          <div
            className={cn(styles.addMember, {
              [styles.addMemberInputInvalid]: !isNewMemberNameValid,
            })}
          >
            {processing && (
              <div className={styles.cover}>
                <LoadingIndicator className={styles.loadingIndicator} />
              </div>
            )}
            <input
              type="text"
              disabled={processing || disabled}
              onChange={async e => {
                setAddMemberName(e.target.value);

                const isNameValid = await validateUserAccount(
                  e.target.value,
                  nearService
                );

                setIsNewMemberNameValid(isNameValid);
              }}
              className={styles.addMemberInput}
              value={addMemberName}
              placeholder="Type member name"
              onKeyPress={onMemberInputButtonPress}
              onPaste={onPasteMembers}
            />
            <Button
              variant="transparent"
              className={cn(styles.addMemberTrigger, {
                [styles.addMemberTriggerActive]:
                  addMemberName.trim().length > 0,
              })}
              disabled={addMemberName.trim().length === 0 || disabled}
              onClick={handleAddGroupMember}
            >
              <Icon name="buttonAdd" />
            </Button>
          </div>

          {showSearchResult && (
            <p className={styles.searchResult}>
              Search result: {filteredMembers.length}
            </p>
          )}

          {(showSearchResult ? filteredMembers : members).map(member => (
            <div className={styles.member} key={member}>
              <p className={styles.memberName}>{member}</p>

              <Button
                variant="transparent"
                className={styles.memberRemove}
                disabled={disabled}
                onClick={() => handleRemoveGroupMember(member)}
              >
                <Icon name="buttonDelete" />
              </Button>
            </div>
          ))}

          {(showSearchResult ? filteredMembers : members).length === 0 && (
            <div className={styles.emptyMembers}>
              <Icon name="proposalAddMember" />

              <p>Add new members</p>
            </div>
          )}
        </div>

        <GroupQuorum
          disabled={disabled}
          quorum={parseInt(group.votePolicy.quorum || '1', 10)}
          onChange={(quorumValue: number) => handleUpdateQuorum(quorumValue)}
        />
      </div>
    </div>
  );
};
