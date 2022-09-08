/* eslint-disable @typescript-eslint/ban-ts-comment,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { useWalletContext } from 'context/WalletContext';

import { DraftComment } from 'services/DraftsService/types';

import { EditableContent } from 'astro_2.0/components/EditableContent';

import {
  Comment,
  CommentProps,
} from 'astro_2.0/features/Comments/components/Comment';

jest.mock('next-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

jest.mock('context/WalletContext', () => {
  return {
    useWalletContext: jest.fn(() => ({})),
  };
});

jest.mock('astro_2.0/components/EditableContent', () => {
  return {
    EditableContent: jest.fn(() => <div />),
  };
});

describe('Comment', () => {
  function renderComment(
    props?: Partial<CommentProps>,
    data?: Partial<DraftComment>
  ) {
    const d = {
      id: 'some id',
      contextId: 'noContext',
      contextType: 'DraftProposal',
      author: 'I am!',
      message: 'Hello World!',
      replies: [],
      likeAccounts: [],
      createdAt: '2022-08-13T18:54:03.854Z',
      updatedAt: '2022-08-13T18:54:03.854Z',
      ...data,
    } as DraftComment;

    const emptyFn = () => Promise.resolve();

    return render(
      <Comment
        data={d}
        onLike={emptyFn}
        onDislike={emptyFn}
        onReply={emptyFn}
        onEdit={emptyFn}
        onDelete={emptyFn}
        isEditable={false}
        {...props}
      />
    );
  }

  it('Should render comment', () => {
    const message = 'This is my custom message';

    const { getByText } = renderComment({}, { message });

    expect(getByText(message)).toBeInTheDocument();
  });

  it('Should call onReply', () => {
    // @ts-ignore
    EditableContent.mockImplementation(
      ({ handleSend }: { handleSend: () => 0 }) => (
        <div onClick={handleSend}>Send</div>
      )
    );

    // @ts-ignore
    useWalletContext.mockImplementation(() => ({ accountId: 'accountId' }));

    const onReply = jest.fn();

    const { getByText } = renderComment(
      { onReply },
      {
        replies: [
          {
            id: 'reply id',
            author: 'reply author',
            createdAt: '2022-08-13T20:02:41.729Z',
            updatedAt: '2022-08-13T20:02:41.729Z',
            message: 'reply message',
          } as DraftComment,
        ],
      }
    );

    fireEvent.click(getByText('drafts.comments.reply'));

    fireEvent.click(getByText('Send'));

    expect(onReply).toBeCalled();
  });

  it('Should call onEdit', () => {
    // @ts-ignore
    EditableContent.mockImplementation(
      ({ handleSend }: { handleSend: () => 0 }) => (
        <div onClick={handleSend}>Edit</div>
      )
    );

    const onEdit = jest.fn();

    const { getByText, getAllByRole } = renderComment({
      onEdit,
      isEditable: true,
    });

    fireEvent.click(getAllByRole('button')[1]);
    fireEvent.click(getByText('Edit'));

    expect(onEdit).toBeCalled();
  });
});
