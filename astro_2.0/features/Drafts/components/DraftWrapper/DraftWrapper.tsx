import React, { ReactElement } from 'react';

import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';

type DraftWrapperProps = {
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
  children: (
    toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void
  ) => ReactElement;
};

// todo need create provider create proposal
export const DraftWrapper = ({
  children,
  toggleCreateProposal,
}: DraftWrapperProps): ReactElement => {
  if (toggleCreateProposal) {
    return <>{children(toggleCreateProposal)}</>;
  }

  return <>{children()}</>;
};
