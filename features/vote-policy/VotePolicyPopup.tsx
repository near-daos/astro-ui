import React, { useCallback, useState } from 'react';
import { Modal } from 'components/modal';
import { useList } from 'react-use';
import { Policies } from 'features/vote-policy/components/policies';
import { DropdownSelect } from 'components/select/DropdownSelect';
import styles from 'features/vote-policy/vote-policy-popup.module.scss';
import { Button } from 'components/button/Button';
import { PolicyProps } from 'features/vote-policy/helpers';
import { Group } from './components/group/Group';

export interface VotePolicyPopupProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  proposers: string[];
  title: string;
  data: PolicyProps;
}

export const VotePolicyPopup: React.FC<VotePolicyPopupProps> = ({
  isOpen,
  onClose,
  proposers,
  title,
  data
}) => {
  const [proposer, setProposer] = useState<string>(data.whoCanPropose);

  const [selected, { push, removeAt, updateAt }] = useList(data.policies);
  const addPolicy = useCallback(
    () =>
      push({
        whoCanVote: '',
        voteBy: 'Person',
        amount: undefined,
        threshold: undefined
      }),
    [push]
  );
  const removePolicy = useCallback((index: number) => () => removeAt(index), [
    removeAt
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <header className={styles.header}>
        <span>Edit voting policy:</span>
        &nbsp;
        <span>{title}</span>
      </header>
      <div className={styles.content}>
        <div className={styles.proposers}>
          <div className={styles.container}>
            <DropdownSelect
              onChange={v => setProposer(v ?? '')}
              label="Who can propose"
              defaultValue={proposer}
              options={proposers.map(item => ({
                label: item,
                component: <Group name={item} />
              }))}
            />
          </div>
        </div>

        <Policies
          onAdd={addPolicy}
          onUpdate={updateAt}
          onRemove={removePolicy}
          policies={selected}
          groups={data.policies.map(item => item.whoCanVote ?? '')}
          tokens={['NEAR', 'MEW']}
        />

        <div className={styles.footer}>
          <div className={styles.buttons}>
            <Button variant="secondary" size="small" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button
              size="small"
              onClick={() =>
                onClose({
                  whoCanPropose: proposer,
                  policies: selected
                })
              }
            >
              Save and continue
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
