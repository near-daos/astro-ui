import { formatPolicyRatio } from 'features/vote-policy/helpers';

describe('VotePolicy', () => {
  describe('VotePolicy helpers', () => {
    describe('formatPolicyRatio', () => {
      it('handles invalid input data', () => {
        const res = formatPolicyRatio({
          ratio: [],
          weightKind: 'RoleWeight',
          weight: '30',
          kind: '',
          quorum: '',
        });

        expect(res).toEqual(0);
      });

      it('format ratio as expected', () => {
        const res1 = formatPolicyRatio({
          ratio: [30, 100],
          weightKind: 'RoleWeight',
          weight: '30',
          kind: '',
          quorum: '',
        });
        const res2 = formatPolicyRatio({
          ratio: [39, 10000],
          weightKind: 'RoleWeight',
          weight: '30',
          kind: '',
          quorum: '',
        });

        expect(res1).toEqual(30);
        expect(res2).toEqual(0.39);
      });
    });
  });
});
