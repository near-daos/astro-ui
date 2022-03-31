import React, { FC, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from 'components/inputs/Input';

import { getInputWidth } from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent/helpers';

import { GovernanceToken } from 'types/token';
import { Member } from 'astro_2.0/features/CreateProposal/types';

import styles from './MemberRow.module.scss';

export interface MemberRowProps {
  name: string;
  groupName: string;
  governanceToken: GovernanceToken;
  totalDistributed: number;
}

export const MemberRow: FC<MemberRowProps> = ({
  name,
  groupName,
  governanceToken,
  totalDistributed,
}) => {
  const { watch, trigger, setValue } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const currentGroup = watch(`groups.${groupName}`) ?? {};
  const { members } = currentGroup ?? {};
  const member = members
    ? members.find((item: Member) => item.name === name)
    : null;
  const currentValue = member ? member.value : 0;

  return (
    <div className={styles.root}>
      <span className={styles.name}>{name}</span>
      <span className={styles.inputWrapper}>
        <Input
          data-testid="mr-input"
          isBorderless
          onKeyUp={async () => {
            await trigger();
          }}
          inputStyles={{
            padding: '0',
            textAlign: 'right',
            width: getInputWidth(currentValue),
          }}
          className={styles.input}
          value={parseInt(currentValue ?? 0, 10)}
          type="number"
          min={0}
          step={1}
          ref={inputRef}
          size="auto"
          textAlign="left"
          onChange={v => {
            const value = Number((v.target as HTMLInputElement).value);

            const total = +governanceToken.value;
            const spent = +totalDistributed - +currentValue;
            const left = total - spent;

            if (value <= left || (!currentValue && value === left)) {
              if (inputRef.current) {
                inputRef.current.value = parseInt(
                  value.toString(),
                  10
                ).toString();
              }

              let newMembers;

              if (!members) {
                newMembers = [
                  {
                    name,
                    value,
                  },
                ];
              } else {
                const existing = members.find(
                  (item: Member) => item.name === name
                );

                if (!existing) {
                  newMembers = [
                    ...members,
                    {
                      name,
                      value,
                    },
                  ];
                } else {
                  newMembers = members.map((item: Member) => {
                    if (item.name === name) {
                      return {
                        name,
                        value,
                      };
                    }

                    return item;
                  });
                }
              }

              setValue(`groups.${groupName}.members`, newMembers, {
                shouldValidate: true,
              });
            } else {
              setValue(`groups.${groupName}.members`, members, {
                shouldValidate: true,
              });
            }
          }}
        />
        <div className={styles.tokenSuffix}>{governanceToken.name}</div>
      </span>
    </div>
  );
};
