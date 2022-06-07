import { configService } from 'services/ConfigService';
import { awsConfig } from 'config';

export function getAwsImageUrl(flag?: string): string {
  let bucket;
  let region;

  if (flag?.startsWith('http')) {
    return flag;
  }

  if (process.browser) {
    const { appConfig } = configService.get();

    if (appConfig) {
      bucket = appConfig.AWS_BUCKET;
      region = appConfig.AWS_REGION;
    }
  } else {
    const config = awsConfig;

    if (config) {
      bucket = config.bucket;
      region = config.region;
    }
  }

  if (bucket && region) {
    return flag ? `https://${bucket}.s3.${region}.amazonaws.com/${flag}` : '';
  }

  return '';
}
