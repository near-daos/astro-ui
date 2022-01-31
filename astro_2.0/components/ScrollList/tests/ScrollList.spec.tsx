import { render } from 'jest/testUtils';

import { ScrollList } from 'astro_2.0/components/ScrollList';

jest.mock('react-window', () => {
  return {
    VariableSizeList: ({
      children,
    }: {
      children: (i: number) => JSX.Element;
    }) => <div>{children(1)}</div>,
  };
});

describe('Scroll list', () => {
  it('Should render component', () => {
    const { container } = render(
      <ScrollList
        height={100}
        itemSize={i => i}
        itemCount={5}
        renderItem={i => <div>{i}</div>}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
