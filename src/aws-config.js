import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'us-east-1' // Replace with your bucket region
});

// Create S3 instance
export const s3 = new AWS.S3();

// Your bucket name
export const BUCKET_NAME = 'myfinbrand-ocr-documents';
