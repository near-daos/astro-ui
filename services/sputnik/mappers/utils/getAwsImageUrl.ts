import { awsConfig } from 'config';

export function getAwsImageUrl(flag?: string): string {
  return flag
    ? `https://${awsConfig.bucket}.s3.${awsConfig.region}.amazonaws.com/${flag}`
    : '';
}
