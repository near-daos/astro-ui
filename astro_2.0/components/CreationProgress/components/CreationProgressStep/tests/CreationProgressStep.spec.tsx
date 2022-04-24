import { render } from 'jest/testUtils';

import { CreationProgressStep } from 'astro_2.0/components/CreationProgress/components/CreationProgressStep';
import { fireEvent } from '@testing-library/dom';

describe('CreationProgressStep', () => {
  it('Should not fail if no click callback', () => {
    const { getByRole } = render(<CreationProgressStep label="Hello World" />);

    fireEvent.click(getByRole('button'));
  });

  it('Should execute click callback', () => {
    const onClick = jest.fn();
    const value = 'some value';

    const { getByRole } = render(
      <CreationProgressStep
        isComplete
        value={value}
        label="Hello World"
        onItemClick={onClick}
      />
    );

    fireEvent.click(getByRole('button'));

    expect(onClick).toBeCalledWith(value);
  });
});
