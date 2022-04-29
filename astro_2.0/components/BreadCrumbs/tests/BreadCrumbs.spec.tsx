/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { getElementSize } from 'utils/getElementSize';

import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';

jest.mock('utils/getElementSize', () => {
  return {
    getElementSize: jest.fn(),
  };
});

jest.mock('astro_2.0/components/BreadCrumbs/Breadcrumbs.module.scss', () => {
  return {
    item: 'item',
  };
});

describe('breadcrumbs', () => {
  beforeAll(() => {
    // @ts-ignore
    document.getElementById = jest.fn(() => ({}));
  });

  afterAll(() => {
    // @ts-ignore
    document.getElementById.mockRestore();
  });

  it('Should render component', () => {
    // @ts-ignore
    getElementSize.mockImplementation(() => ({ width: 1000 }));

    const { container } = render(
      <BreadCrumbs>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        <div>6</div>
      </BreadCrumbs>
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render 3 last items if breadcrumbs do not fit available space', () => {
    // @ts-ignore
    getElementSize.mockImplementation(() => ({
      width: 10,
      widthWithMargin: 10,
    }));

    const component = render(
      <BreadCrumbs>
        <div data-testid="breadcrumb">1</div>
        <div data-testid="breadcrumb">2</div>
        <div data-testid="breadcrumb">3</div>
        <div data-testid="breadcrumb">4</div>
        <div data-testid="breadcrumb">5</div>
        <div data-testid="breadcrumb">6</div>
      </BreadCrumbs>
    );

    const items = component.queryAllByTestId('breadcrumb');

    expect(items).toHaveLength(3);

    expect(items[0].textContent).toStrictEqual('4');
    expect(items[1].textContent).toStrictEqual('5');
    expect(items[2].textContent).toStrictEqual('6');
  });
});
/* eslint-enable @typescript-eslint/ban-ts-comment */
