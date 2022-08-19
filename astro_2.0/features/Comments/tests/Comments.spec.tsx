import { render } from 'jest/testUtils';

import { DraftComment } from 'services/DraftsService/types';

import { Comments, Props } from 'astro_2.0/features/Comments';

jest.mock('next-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

jest.mock('astro_2.0/features/Comments/components/Comment', () => {
  return {
    Comment: ({ data }: { data: string }) => <div>{data}</div>,
  };
});

describe('Comments', () => {
  function renderComments(props?: Partial<Props>) {
    const data = [] as unknown as DraftComment[];

    return render(
      <Comments
        data={data}
        onLike={() => Promise.resolve()}
        onReply={() => Promise.resolve()}
        onEdit={() => Promise.resolve()}
        onDelete={() => Promise.resolve()}
        canModerate={false}
        accountId="123"
        countComments={0}
        onDislike={() => Promise.resolve()}
        {...props}
      />
    );
  }

  it('Should render comments', () => {
    const c1 = 'Hello World 1!';
    const c2 = 'Hello World 2!';

    const data = [c1, c2] as unknown as DraftComment[];

    const { getByText } = renderComments({
      data,
    });

    expect(getByText(c1)).toBeInTheDocument();
    expect(getByText(c2)).toBeInTheDocument();
  });

  describe('Should render comments count properly', () => {
    it('countComments < 1', () => {
      const { getByText } = renderComments();

      expect(
        getByText('drafts.comments.comment', { exact: false })
      ).toBeInTheDocument();
    });

    it('countComments > 1', () => {
      const { getByText } = renderComments({ countComments: 3 });

      expect(
        getByText('drafts.comments.comments', { exact: false })
      ).toBeInTheDocument();
    });
  });
});
