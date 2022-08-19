import { getElementSize } from 'utils/getElementSize';

describe('get element size', () => {
  beforeAll(() => {
    window.getComputedStyle = jest.fn().mockImplementation(() => ({
      paddingTop: 1,
      paddingBottom: 2,
      paddingLeft: 3,
      paddingRight: 4,
      marginTop: 5,
      marginBottom: 6,
      marginLeft: 7,
      marginRight: 8,
    }));
  });

  afterAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.getComputedStyle.mockRestore();
  });

  it('Should properly calculate sizes', () => {
    const element = {
      clientHeight: 11,
      clientWidth: 12,
      offsetHeight: 13,
      offsetWidth: 14,
    };

    const sizes = getElementSize(element as unknown as HTMLElement);

    expect(sizes).toStrictEqual({
      height: 8,
      width: 5,
      clientHeight: 11,
      clientWidth: 12,
      offsetHeight: 13,
      offsetWidth: 14,
      heightWithMargin: 24,
      widthWithMargin: 29,
    });
  });
});
