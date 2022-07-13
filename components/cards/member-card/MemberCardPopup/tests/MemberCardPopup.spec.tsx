import { render } from 'jest/testUtils';

import { MemberCardPopup } from 'components/cards/member-card/MemberCardPopup/MemberCardPopup';

jest.mock('components/modal', () => {
  return {
    Modal: ({ children }: { children: unknown }) => children,
  };
});

jest.mock('react-text-truncate', () => {
  return ({ text }: { text: string }) => <div>{text}</div>;
});

describe('MemberCardPopup', () => {
  it('Should render component', () => {
    const token = {
      value: 10,
      symbol: 'NEAR',
    };

    const { getByText } = render(
      <MemberCardPopup
        isOpen
        votes={10}
        tokens={token}
        onClose={() => 0}
        title="Hello World"
      >
        <div>Boba</div>
      </MemberCardPopup>
    );

    expect(getByText('Boba')).toBeTruthy();
  });
});
