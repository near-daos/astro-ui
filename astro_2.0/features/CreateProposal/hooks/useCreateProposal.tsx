import { ComponentType } from 'react';
import {
  CreateProposal,
  CreateProposalProps,
} from 'astro_2.0/features/CreateProposal';
import useToggleable from 'hooks/useToggleable';
import { useAuthCheck } from 'astro_2.0/features/Auth';

export const useCreateProposal = (): [
  ComponentType<CreateProposalProps>,
  (props?: Partial<CreateProposalProps>) => void
] => {
  const [TCreateProposal, toggleCreateProposal] = useToggleable(CreateProposal);

  const toggleWithAuthCreateProposal = useAuthCheck(
    (props?: Partial<CreateProposalProps>) => toggleCreateProposal(props),
    []
  );

  return [TCreateProposal, toggleWithAuthCreateProposal];
};
