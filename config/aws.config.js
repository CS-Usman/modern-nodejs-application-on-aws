import AWS from "aws-sdk";
import "dotenv/config";
// aws sdk provides AWS service classes (client classes ) from which we can create service objects

export const s3Client = new AWS.S3({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

export const ssmClient = new AWS.SSM({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});
