import AWS from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { awsConfig, appConfig } from 'config';
import { nanoid } from 'nanoid';
import { Readable } from 'form-data';

const SECOND = 1000;

const getGlobalAWSConfig = () => {
  let baseConfig: AWS.ConfigurationOptions = {
    httpOptions: {
      timeout: SECOND * 30,
    },
  };

  if (appConfig.awsUseLocalConf) {
    baseConfig = {
      ...baseConfig,
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
    };
  } else {
    baseConfig = {
      ...baseConfig,
      region: awsConfig.region,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: awsConfig.identityPoolId,
      }),
    };
  }

  return baseConfig;
};

const getInstanceConfig = () => {
  if (appConfig.awsUseLocalConf) {
    return {
      apiVersion: awsConfig.apiVersion,
      params: { Bucket: awsConfig.bucket },
      endpoint: awsConfig.endpoint,
      s3ForcePathStyle: awsConfig.s3ForcePathStyle,
    };
  }

  return {
    apiVersion: awsConfig.apiVersion,
    params: { Bucket: awsConfig.bucket },
  };
};

AWS.config.update(getGlobalAWSConfig());

export const awsS3 = new AWS.S3(getInstanceConfig());

export class AwsUploader {
  awsS3Instance: AWS.S3;

  bucketName: string;

  constructor(awsS3Instance: AWS.S3, bucketName: string) {
    this.awsS3Instance = awsS3Instance;
    this.bucketName = bucketName;
  }

  uploadToBucket = async (
    file: File | Readable
  ): Promise<ManagedUpload.SendData> => {
    return this.awsS3Instance
      .upload({
        Bucket: this.bucketName,
        Key: nanoid(),
        Body: file,
        ACL: 'public-read',
        ContentType: 'image/png',
      })
      .promise();
  };
}

const awsUploader = new AwsUploader(awsS3, awsConfig.bucket);

export default awsUploader;
