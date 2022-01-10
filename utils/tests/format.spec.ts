import {
  formatTimestampAsDate,
  formatYoktoValue,
  kFormatter,
  shortenString,
} from 'utils/format';

describe('format', () => {
  describe('formatYoktoValue', () => {
    it('Should return 0 if no value provided', () => {
      expect(formatYoktoValue('')).toStrictEqual('0');
    });

    it('Should use custom divider if provided', () => {
      expect(formatYoktoValue('100', 2)).toStrictEqual('1');
      expect(formatYoktoValue('1', 2)).toStrictEqual('0.01');
    });

    it('Should turn value in yokto near', () => {
      expect(formatYoktoValue('1000000000000000000000')).toStrictEqual('0.001');
    });
  });

  describe('formatTimestampAsDate', () => {
    it('Should properly format timestamp in kiloseconds to "dd LLL yyyy HH:mm:ss"', () => {
      const date = formatTimestampAsDate('1641680883161000000');

      expect(date).toStrictEqual('09 Jan 2022 00:28:03');
    });
  });

  describe('kFormatter', () => {
    it('Should return 0 if argument is not defined', () => {
      expect(kFormatter((undefined as unknown) as number)).toStrictEqual('0');
    });

    it('Should properly format number', () => {
      expect(kFormatter(80000000000)).toStrictEqual('80G');
      expect(kFormatter(7000000000)).toStrictEqual('7G');
      expect(kFormatter(20000000)).toStrictEqual('20M');
      expect(kFormatter(3000)).toStrictEqual('3K');

      // TODO check if it's an expected behaviour
      expect(kFormatter(3999)).toStrictEqual('4K');
    });

    it('Should not shorten numbers that are less than 1000', () => {
      expect(kFormatter(999)).toStrictEqual('999');
      expect(kFormatter(1)).toStrictEqual('1');

      // TODO check if it's an expected behaviour
      expect(kFormatter(777.777)).toStrictEqual('778');
    });
  });

  describe('shortenString', () => {
    it('Should return empty string if value is empty', () => {
      expect(shortenString('', 0)).toStrictEqual('');
    });

    it('Should not change string if value length is less than defined maxLength or is less than 20', () => {
      const stringThatIsMoreThan20CharsInLength =
        'eat some more of these soft French rolls and have some tea';

      expect(shortenString('hello world', 1)).toStrictEqual('hello world');

      expect(
        shortenString(stringThatIsMoreThan20CharsInLength, 100)
      ).toStrictEqual(stringThatIsMoreThan20CharsInLength);
    });

    // TODO check that method works properly. Looks like result is wrong
    it('Should properly truncate string', () => {
      const stringThatIsMoreThan20CharsInLength =
        'eat some more of these soft French rolls and have some tea';

      expect(
        shortenString(stringThatIsMoreThan20CharsInLength, 10)
      ).toStrictEqual('eat so...e tea');
    });
  });
});
