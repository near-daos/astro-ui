import map from 'lodash/map';
import split from 'lodash/split';
import reduce from 'lodash/reduce';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useState, useCallback, ClipboardEvent } from 'react';

import { useWalletContext } from 'context/WalletContext';

import { validateUserAccount } from 'astro_2.0/features/CreateProposal/helpers';

type Input = {
  setAddMemberName: (name: string) => void;
  addGroupMembers: (members: string[]) => void;
};

type PasteProcessOutput = {
  processing: boolean;
  onPasteMembers: (e: ClipboardEvent) => void;
};

export function useProcessMembersPaste(input: Input): PasteProcessOutput {
  const { addGroupMembers, setAddMemberName } = input;

  const { groupUploadOfGroupMembers } = useFlags();
  const [processing, setProcessing] = useState(false);

  const { nearService } = useWalletContext();

  const onPasteMembers = useCallback(
    async e => {
      if (groupUploadOfGroupMembers) {
        setProcessing(true);

        const pastedString = e.clipboardData.getData('text');

        const membersByLineBreak = split(pastedString, /\r?\n/);
        const membersBySpaces = flatten(
          map(membersByLineBreak, m => split(m, ' '))
        );
        const nonEmptyMembers = compact(membersBySpaces);
        const uniqueMembers = [...new Set(nonEmptyMembers)];

        const validationPromises = uniqueMembers.map(member =>
          validateUserAccount(member, nearService)
        );

        const validationResult = await Promise.allSettled(validationPromises);

        const membersToAdd = reduce(
          validationResult,
          (acc, res, index) => {
            if (res.status === 'fulfilled' && res.value) {
              acc.push(uniqueMembers[index].trim());
            }

            return acc;
          },
          [] as string[]
        );

        addGroupMembers(membersToAdd);

        setTimeout(() => {
          setAddMemberName('');
          setProcessing(false);
        }, 500);
      }
    },
    [nearService, addGroupMembers, setAddMemberName, groupUploadOfGroupMembers]
  );

  return {
    processing,
    onPasteMembers,
  };
}
