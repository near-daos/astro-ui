import { DraftComment } from 'types/draftProposal';
import { useCallback } from 'react';

export function useDraftComments(): {
  data: DraftComment[];
  addComment: (val: string) => Promise<void>;
  likeComment: (id: string) => Promise<void>;
} {
  const data: DraftComment[] = [
    {
      id: '1',
      likes: 0,
      author: 'jamesbond.near',
      createdAt: '2021-11-25T15:25:59.159Z',
      updatedAt: '2021-11-25T15:25:59.159Z',
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget scelerisque fringilla auctor consequat non ornare. Aliquet convallis commodo neque molestie sed. Pellentesque tortor proin dignissim quis feugiat. Cursus ut sed habitasse blandit malesuada felis. Ipsum arcu a nunc ut nibh. Viverra vulputate ut venenatis cursus rhoncus, at convallis egestas. `,
      comments: undefined,
    },
    {
      id: '2',
      likes: 0,
      author: 'ethanhunt.near',
      createdAt: '2021-11-25T15:25:59.159Z',
      updatedAt: '2021-11-25T15:25:59.159Z',
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget scelerisque fringilla auctor consequat non ornare.`,
      comments: [
        {
          id: '3',
          likes: 0,
          author: 'jasonborn.near',
          createdAt: '2021-11-25T15:25:59.159Z',
          updatedAt: '2021-11-25T15:25:59.159Z',
          description: `Eget scelerisque fringilla auctor consequat non ornare.`,
          comments: undefined,
        },
        {
          id: '4',
          likes: 0,
          author: 'rudolfabel.near',
          createdAt: '2021-11-25T15:25:59.159Z',
          updatedAt: '2021-11-25T15:25:59.159Z',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget scelerisque fringilla auctor consequat non ornare. Aliquet convallis commodo neque molestie sed. Pellentesque tortor proin dignissim quis feugiat. Cursus ut sed habitasse blandit malesuada felis. Ipsum arcu a nunc ut nibh. Viverra vulputate ut venenatis cursus rhoncus, at convallis egestas.`,
          comments: undefined,
        },
      ],
    },
  ];

  const addComment = useCallback(async (val: string) => {
    // eslint-disable-next-line no-console
    console.log('adding comment', val);
  }, []);

  const likeComment = useCallback(async (id: string) => {
    // eslint-disable-next-line no-console
    console.log('like comment', id);
  }, []);

  return {
    data,
    addComment,
    likeComment,
  };
}
