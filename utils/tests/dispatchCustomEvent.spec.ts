import get from 'lodash/get';

import { dispatchCustomEvent } from 'utils/dispatchCustomEvent';

describe('dispatch custom event', () => {
  beforeAll(() => {
    document.dispatchEvent = jest.fn();
  });

  afterAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.dispatchEvent.mockRestore();
  });

  it('Should dispatch event', () => {
    const name = 'CUSTOM_NAME';
    const payload = { hello: 'world' };

    dispatchCustomEvent(name, payload);

    const { type, detail } = get(document.dispatchEvent, 'mock.calls.0.0');

    expect(type).toStrictEqual(name);
    expect(detail).toStrictEqual(payload);
  });
});
