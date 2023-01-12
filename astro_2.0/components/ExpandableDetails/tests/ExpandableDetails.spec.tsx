import { act } from '@testing-library/react';
import { render } from 'jest/testUtils';

import { fireEvent } from '@testing-library/dom';

import { ExpandableDetails } from 'astro_2.0/components/ExpandableDetails';

jest.mock(
  'astro_2.0/components/ExpandableDetails/ExpandableDetails.module.scss',
  () => {
    return {
      opened: 'opened',
    };
  }
);

describe('expandable details', () => {
  it('Should render component', () => {
    const { container } = render(
      <ExpandableDetails label="Label">Hello World</ExpandableDetails>
    );

    expect(container).toMatchSnapshot();
  });

  it('Should expand content on click', () => {
    const component = render(
      <ExpandableDetails label="Label">Hello World</ExpandableDetails>
    );

    act(() => {
      fireEvent.click(component.getByTestId('button'));
    });

    expect(component.getByText('Hello World')).toHaveClass('opened');
  });
});
