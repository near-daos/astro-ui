/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { CopyButton } from 'astro_2.0/components/CopyButton';

describe('copy button', () => {
  const originalClipboard = { ...global.navigator.clipboard };
  const originalSecureContext = global.window.isSecureContext;

  beforeAll(() => {
    const mockClipboard = {
      writeText: jest.fn(),
    };

    // @ts-ignore
    global.window.isSecureContext = true;

    // @ts-ignore
    global.navigator.clipboard = mockClipboard;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    // @ts-ignore
    global.navigator.clipboard = originalClipboard;
    // @ts-ignore
    global.window.isSecureContext = originalSecureContext;
  });

  it('Should render component', () => {
    const { container } = render(<CopyButton text="Copy Me!" />);

    expect(container).toMatchSnapshot();
  });

  it('Should copy text by click', async () => {
    const title = 'Some Title';
    const component = render(<CopyButton text="Copy Me!">{title}</CopyButton>);

    fireEvent.click(component.getByText(title));

    expect(navigator.clipboard.writeText).toBeCalledWith('Copy Me!');
  });
});

/* eslint-enable @typescript-eslint/ban-ts-comment */
