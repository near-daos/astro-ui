/* eslint-disable react/no-children-prop,@typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';

import { DraftWrapper } from 'astro_2.0/features/Drafts/components/DraftWrapper';

describe('DraftWrapper', () => {
  it('Should render children', () => {
    const children = jest.fn(() => null);

    // @ts-ignore
    render(<DraftWrapper children={children} />);

    expect(children).toBeCalledWith();
  });

  it('Should render children', () => {
    const toggleCreateProposal = 'toggleCreateProposal';
    const children = jest.fn(() => null);

    render(
      <DraftWrapper
        // @ts-ignore
        children={children}
        // @ts-ignore
        toggleCreateProposal={toggleCreateProposal}
      />
    );

    expect(children).toBeCalledWith(toggleCreateProposal);
  });
});
