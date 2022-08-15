import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import {
  LikeButton,
  LikeButtonProps,
} from 'astro_2.0/features/Comments/components/Comment/LikeButton';

describe('LikeButton', () => {
  function renderLikeButton(props?: Partial<LikeButtonProps>) {
    return render(
      <LikeButton
        amount={0}
        disabled={false}
        isActive={false}
        onClick={() => 0}
        {...props}
      />
    );
  }

  it('Should render correct amount of likes', () => {
    const amount = 5;

    const { getByText } = renderLikeButton({ amount });

    expect(getByText(amount)).toBeInTheDocument();
  });

  it('Should call onClick handler', () => {
    const onClick = jest.fn();

    const { getByRole } = renderLikeButton({ onClick });

    fireEvent.click(getByRole('button'));

    expect(onClick).toBeCalled();
  });
});
