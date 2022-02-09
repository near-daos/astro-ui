import { AwsUploader } from 'services/AwsUploader';

jest.mock('aws-sdk', () => {
  class mockS3 {
    // eslint-disable-next-line class-methods-use-this
    upload() {
      return {
        promise: () => Promise.resolve('HelloWorld'),
      };
    }
  }

  return {
    ...jest.requireActual('aws-sdk'),
    S3: mockS3,
  };
});

describe('AWS uploader', () => {
  it('Should return response when upload is successful', async () => {
    const response = await AwsUploader.uploadToBucket(
      new File(['foo'], 'foo.txt', {
        type: 'text/plain',
      })
    );

    expect(response).toStrictEqual('HelloWorld');
  });
});
