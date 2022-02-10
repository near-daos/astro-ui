import { AwsUploader } from 'services/AwsUploader';

jest.mock('aws-sdk', () => {
  class mockS3 {
    // eslint-disable-next-line class-methods-use-this
    upload() {
      return {
        promise: () => Promise.reject(),
      };
    }
  }

  return {
    ...jest.requireActual('aws-sdk'),
    S3: mockS3,
  };
});

describe('AWS uploader', () => {
  it('Should return rejected promise if could not upload file', async () => {
    const file = new File(['foo'], 'foo.txt', {
      type: 'text/plain',
    });

    expect(AwsUploader.uploadToBucket(file)).rejects.toBeUndefined();
  });
});
