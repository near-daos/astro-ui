import { getAwsImageUrl } from 'services/sputnik/mappers/utils/getAwsImageUrl';

jest.mock('config/aws', () => {
  return {
    awsConfig: {
      bucket: 'bucket',
      region: 'region',
    },
  };
});

describe('getAwsImageUrl', () => {
  it('Should return empty string if flag not provided', () => {
    expect(getAwsImageUrl()).toStrictEqual('');
  });

  it('Should return flag url', () => {
    expect(getAwsImageUrl('flag')).toStrictEqual(
      'https://bucket.s3.region.amazonaws.com/flag'
    );
  });
});
