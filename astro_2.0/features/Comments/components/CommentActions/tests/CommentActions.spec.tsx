/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { useModal } from 'components/modal';

import {
  Props,
  CommentActions,
} from 'astro_2.0/features/Comments/components/CommentActions';

jest.mock('next-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

jest.mock('components/modal', () => {
  return {
    useModal: jest.fn(() => []),
  };
});

describe('CommentActions', () => {
  function renderCommentActions(props?: Partial<Props>) {
    return render(
      <CommentActions
        onEdit={() => 0}
        onDelete={() => Promise.resolve()}
        id="123"
        isEditable
        {...props}
      />
    );
  }

  it('Should render nothing', () => {
    const { container } = renderCommentActions({ isEditable: false });

    expect(container).toMatchSnapshot();
  });

  it('Should render content', () => {
    const { getAllByRole } = renderCommentActions();

    expect(getAllByRole('button')).toHaveLength(2);
  });

  it('Should call onDelete handler', async () => {
    const onDelete = jest.fn();

    // @ts-ignore
    useModal.mockImplementation(() => [() => Promise.resolve([true])]);

    const { getAllByRole } = renderCommentActions({ onDelete });

    await fireEvent.click(getAllByRole('button')[0]);

    expect(onDelete).toBeCalled();
  });
});
