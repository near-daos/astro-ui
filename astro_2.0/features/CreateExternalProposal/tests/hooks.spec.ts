import {
  isActionValid,
  isVariantValid,
} from 'astro_2.0/features/CreateExternalProposal/hooks';
import { ProposalVariant } from 'types/proposal';

describe('create external proposal', () => {
  it('Should return false if provided action is invalid', () => {
    const action = 'some_action';

    expect(isActionValid(action)).toBeFalsy();
  });

  it('Should return true if provided action is valid', () => {
    const action = 'create_proposal';

    expect(isActionValid(action)).toBeTruthy();
  });

  it('Should accept only known Proposal Variants', () => {
    expect(isVariantValid(ProposalVariant.ProposeChangeDaoName)).toBeTruthy();
    expect(isVariantValid(ProposalVariant.ProposeAddMember)).toBeTruthy();
    expect(isVariantValid('some_variant')).toBeFalsy();
  });
});
