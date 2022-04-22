import React, { FC, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';

import { Badge, getBadgeVariant } from 'components/Badge';
import { Toggle } from 'components/inputs/Toggle';
import { Input } from 'components/inputs/Input';
import { MemberRow } from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent/MemberRow';

import { getInputWidth } from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent/helpers';

import { GovernanceToken } from 'types/token';
import { Member } from 'astro_2.0/features/CreateProposal/types';

import styles from './GroupRow.module.scss';

export interface GroupRowProps {
  name: string;
  numberOfMembers: number;
  members: string[];
  governanceToken: GovernanceToken;
  totalDistributed: number;
}

export const GroupRow: FC<GroupRowProps> = ({
  name,
  numberOfMembers,
  members,
  governanceToken,
  totalDistributed,
}) => {
  const {
    watch,
    trigger,
    setValue,
    formState: { errors, touchedFields },
  } = useFormContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const currentGroup = watch(`groups.${name}`) ?? {};
  const isCustom = watch(`groups.${name}.isCustom`) ?? false;
  const currentValue = watch(`groups.${name}.groupTotal`) ?? 0;
  const membersEntries = (currentGroup?.members ?? []) as Member[];
  const totalDistributedInGroup = isCustom
    ? membersEntries.reduce((res, item) => res + +item.value, 0)
    : currentValue * numberOfMembers;

  return (
    <>
      <div className={cn(styles.root)}>
        <div className={styles.title}>
          <Badge size="small" variant={getBadgeVariant(name)}>
            <div className={styles.groupBadge}>
              <div className={styles.groupName}>{name}</div>&nbsp;
              <div>({numberOfMembers})</div>
            </div>
          </Badge>
        </div>
        <div
          className={cn(styles.member, {
            [styles.disabled]: isCustom,
          })}
        >
          <Input
            data-testid="gr-input"
            isBorderless
            onKeyUp={async () => {
              await trigger();
            }}
            inputStyles={{
              padding: '0',
              textAlign: 'right',
              width: getInputWidth(currentValue),
            }}
            disabled={isCustom}
            className={styles.input}
            value={parseInt(currentValue ?? 0, 10)}
            type="number"
            min={0}
            step={1}
            ref={inputRef}
            isValid={
              touchedFields?.groups?.[name]?.groupTotal &&
              !errors?.groups?.[name]?.groupTotal?.message
            }
            size="auto"
            textAlign="left"
            onChange={v => {
              const value = Number((v.target as HTMLInputElement).value);

              const total = +governanceToken.value;
              const spent = +totalDistributed - +currentValue;
              const left = total - spent;
              const futureValue = value * numberOfMembers;

              if (
                futureValue <= left ||
                (!currentValue && futureValue === left)
              ) {
                if (inputRef.current) {
                  inputRef.current.value = parseInt(
                    value.toString(),
                    10
                  ).toString();
                }

                setValue(`groups.${name}.groupTotal`, value, {
                  shouldValidate: true,
                });
              } else {
                setValue(`groups.${name}.groupTotal`, currentValue, {
                  shouldValidate: true,
                });
              }
            }}
          />
          <div className={styles.tokenSuffix}>{governanceToken.name}</div>
        </div>
        <div className={styles.control}>
          <Toggle
            label="Custom"
            checked={isCustom}
            onClick={() => {
              setValue(`groups.${name}`, {
                ...currentGroup,
                members: null,
                isCustom: !isCustom,
              });
            }}
          />
        </div>
        <div className={styles.group}>
          <div className={styles.input}>{totalDistributedInGroup}</div>
          <div className={styles.suffix}>{governanceToken.name}</div>
        </div>
      </div>
      <AnimatePresence>
        {isCustom && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.membersContainer}
          >
            {members.map(member => {
              return (
                <MemberRow
                  name={member}
                  totalDistributed={totalDistributed}
                  governanceToken={governanceToken}
                  groupName={name}
                  key={member}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
