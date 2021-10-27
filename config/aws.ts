export const awsConfig = {
  endpoint: process.env.NEXT_PUBLIC_AWS_ENDPOINT || '',
  s3ForcePathStyle:
    Boolean(process.env.NEXT_PUBLIC_AWS_S3_FORCE_PATH_STYLE) || false,
  apiVersion: process.env.NEXT_PUBLIC_AWS_API_VERSION || '',
  bucket: process.env.NEXT_PUBLIC_AWS_BUCKET || '',
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION || '',
  identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID || '',
};
