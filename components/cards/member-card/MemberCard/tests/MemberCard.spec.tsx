/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import MemberCard from 'components/cards/member-card/MemberCard';

jest.mock('react-text-truncate', () => {
  return ({ text }: { text: string }) => <div>{text}</div>;
});

jest.mock('components/Icon', () => {
  return {
    Icon: ({ name }: { name: string }) => <div>{name}</div>,
  };
});

describe('MemberCard', () => {
  it('Should render component', () => {
    const onRemoveClick = jest.fn();

    const { getByText } = render(
      <MemberCard title="Hello World" votes={10} onRemoveClick={onRemoveClick}>
        Hello World
      </MemberCard>
    );

    fireEvent.click(getByText('proposalRemoveMember'));

    expect(onRemoveClick).toBeCalled();
  });

  describe('On card click', () => {
    it('Should not fail if no callback', () => {
      // @ts-ignore
      const { getByRole } = render(<MemberCard>Hello World</MemberCard>);

      fireEvent.keyPress(getByRole('button'), {
        key: 'Enter',
        code: 'Enter',
        charCode: 13,
      });
    });
  });

  it('Should process card click', () => {
    const onClick = jest.fn();

    const { getByRole } = render(
      // @ts-ignore
      <MemberCard onClick={onClick}>Hello World</MemberCard>
    );

    fireEvent.keyPress(getByRole('button'), {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    expect(onClick).toBeCalled();
  });
});
