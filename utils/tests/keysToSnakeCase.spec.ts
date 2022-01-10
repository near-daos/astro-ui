import { keysToSnakeCase } from 'utils/keysToSnakeCase';

describe('Keys to snake case', () => {
  it('Should properly process object', () => {
    const data = {
      dataOne: 'dataOne',
      DataTwo: 'dataTwo',
      dataThree: {
        DataFour: 'dataFour',
      },
    };

    expect(keysToSnakeCase(data)).toStrictEqual({
      data_one: 'dataOne',
      data_two: 'dataTwo',
      data_three: { data_four: 'dataFour' },
    });
  });

  it('Should properly process array', () => {
    const data = [{ dataOne: 'dataOne' }, { DataTwo: 'dataTwo' }];

    expect(keysToSnakeCase(data)).toStrictEqual([
      { data_one: 'dataOne' },
      { data_two: 'dataTwo' },
    ]);
  });
});
