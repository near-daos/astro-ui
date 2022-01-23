import { jsonToBase64Str } from 'utils/jsonToBase64Str';

describe('json to base 64 str', () => {
  it('Should turn object into base 64 string', () => {
    const data = {
      hello: 'world',
    };

    expect(jsonToBase64Str(data)).toStrictEqual('eyJoZWxsbyI6IndvcmxkIn0=');
  });
});
