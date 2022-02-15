import { configService } from 'services/ConfigService';
import { awsConfig } from 'config';

export function getAwsImageUrl(flag?: string): string {
  let bucket;
  let region;

  if (process.browser) {
    const config = configService.get();

    if (config) {
      bucket = config.AWS_BUCKET;
      region = config.AWS_REGION;
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
