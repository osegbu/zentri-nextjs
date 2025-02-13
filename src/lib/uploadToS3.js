import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const S3_BUCKET = "obinnasocialmedia";
const REGION = "us-east-1";

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToS3 = async (folder, file) => {
  const fileName = `${folder}/${Date.now()}_${file.name}`;

  const params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Body: file,
    ContentType: file.type,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    const imageUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`;
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
