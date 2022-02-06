export const awsConfig = {
  endpoint: process.env.AWS_ENDPOINT || '',
  s3ForcePathStyle: Boolean(process.env.AWS_S3_FORCE_PATH_STYLE) || false,
  apiVersion: process.env.AWS_API_VERSION || '',
  bucket: process.env.AWS_BUCKET || '',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || '',
  identityPoolId: process.env.AWS_IDENTITY_POOL_ID || '',
};
