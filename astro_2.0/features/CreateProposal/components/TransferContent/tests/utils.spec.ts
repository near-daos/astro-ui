import { getProposalAmountWidth } from 'astro_2.0/features/CreateProposal/components/TransferContent/utils';

describe('TransferContent utils', () => {
  describe('getProposalAmountWidth', () => {
    it('Should return proper value', () => {
      expect(getProposalAmountWidth('12345')).toEqual(7);
      expect(getProposalAmountWidth('12345678')).toEqual(8);
      expect(getProposalAmountWidth('123456789012345')).toEqual(15);
    });
  });
});
