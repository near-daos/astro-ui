import { ReactNode } from 'react';
import { render } from 'jest/testUtils';

import { Collapsable } from 'components/collapsable/Collapsable';

jest.mock('react-animate-height', () => {
  return ({ height, children }: { height: number; children: ReactNode }) => (
    <div>
      <div data-testid="height-info">{height}</div>
      {children}
    </div>
  );
});

describe('Collapsable', () => {
  it('Should render heading', () => {
    const header = 'I am header';

    function renderHeader() {
      return <div>{header}</div>;
    }

    const { getByText } = render(<Collapsable renderHeading={renderHeader} />);

    expect(getByText(header)).toBeTruthy();
  });

  it('Should properly process open state', () => {
    const height = '123px';
    const children = jest.fn();

    const { getByTestId } = render(
      <Collapsable isOpen height={height} renderHeading={() => <div />}>
        {children}
      </Collapsable>
    );

    expect(children).toBeCalledWith(true);
    expect(getByTestId('height-info').textContent).toEqual(height);
  });
});
