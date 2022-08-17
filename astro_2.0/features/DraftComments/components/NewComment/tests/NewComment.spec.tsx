/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions,@typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { useWalletContext } from 'context/WalletContext';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider';

import { NewComment } from 'astro_2.0/features/DraftComments/components/NewComment';

jest.mock('context/WalletContext', () => {
  return {
    useWalletContext: jest.fn(() => ({
      accountId: 'account',
    })),
  };
});

jest.mock('astro_2.0/features/Drafts/components/DraftsProvider', () => {
  return {
    useDraftsContext: jest.fn(() => ({})),
  };
});

jest.mock('astro_2.0/components/EditableContent', () => {
  return {
    EditableContent: jest.fn(({ handleSend }) => (
      <div onClick={handleSend}>EditableContent</div>
    )),
  };
});

describe('NewComment', () => {
  it('Should render nothing if no account', () => {
    // @ts-ignore
    useWalletContext.mockImplementationOnce(() => ({}));

    const { container } = render(<NewComment onSubmit={() => 0} />);

    expect(container).toMatchSnapshot();
  });

  it('Should render "EditableContent" component', () => {
    // @ts-ignore
    useDraftsContext.mockImplementation(() => ({ toggleWriteComment: true }));

    const { getByText } = render(<NewComment onSubmit={() => 0} />);

    expect(getByText('EditableContent')).toBeInTheDocument();
  });

  it('Should render "Write Comment" button', () => {
    // @ts-ignore
    useDraftsContext.mockImplementation(() => ({ toggleWriteComment: false }));

    const { getByText } = render(<NewComment onSubmit={() => 0} />);

    expect(getByText('drafts.comments.writeCommentButton')).toBeInTheDocument();
  });

  it('Should handle button click', () => {
    const setToggleWriteComment = jest.fn();

    // @ts-ignore
    useDraftsContext.mockImplementation(() => ({
      toggleWriteComment: false,
      setToggleWriteComment,
    }));

    const { getByText } = render(<NewComment onSubmit={() => 0} />);

    fireEvent.click(getByText('drafts.comments.writeCommentButton'));

    expect(setToggleWriteComment).toBeCalled();
  });

  it('Should call "onSubmit" handler', () => {
    const onSubmit = jest.fn(() => Promise.resolve());

    // @ts-ignore
    useDraftsContext.mockImplementation(() => ({ toggleWriteComment: true }));

    const { getByText } = render(<NewComment onSubmit={onSubmit} />);

    fireEvent.click(getByText('EditableContent'));

    expect(onSubmit).toBeCalled();
  });
});
