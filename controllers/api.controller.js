import { s3Client, ssmClient } from "../config/aws.config.js";
import multer from "multer";
import { randomBytes } from "crypto";
import sharp from "sharp";
import S3 from "../models/user.s3.model.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const createS3Bucket = async (req, res, next) => {
  const { bucketName } = req.body;

  if (!bucketName) {
    return res.status(400).json({
      success: false,
      error: "Please provide bucket name to create bucket",
    });
  }

  const params = {
    Bucket: bucketName,
  };

  try {
    const createResult = await s3Client.createBucket(params).promise();

    if (!createResult) {
      return res.status(400).json({
        success: false,
        error: "Unable to create bucket",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Bucket created successfully",
      data: createResult,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const listAllBuckets = async (req, res, next) => {
  try {
    const listResult = await s3Client.listBuckets({}).promise();
    console.log(listResult);
    if (!listResult) {
      return res.status(400).json({
        success: false,
        error: "No buckets to show create one",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Bucket created successfully",
      data: listResult,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const uploadDataToS3 = async (req, res, next) => {
  const { bucketName, caption } = req.body;
  const { file } = req;

  if (!bucketName) {
    return res.status(400).json({
      success: false,
      error: "Please provide bucket name to upload data in bucket",
    });
  }

  if (!file) {
    return res.status(400).json({
      success: false,
      error: `Please provide image to upload in bucket ${bucketName}`,
    });
  }

  try {
    const checkIfExists = await s3Client
      .headBucket({ Bucket: bucketName })
      .promise();

    if (!checkIfExists) {
      return res.status(400).json({
        success: false,
        error: "No buckets exists with this name",
      });
    }

    const generateFileName = randomBytes(32).toString("hex");
    const fileBuffer = await sharp(file.buffer)
      .resize({ height: 1920, width: 1080, fit: "contain" })
      .toBuffer();

    const params = {
      Body: fileBuffer,
      Bucket: bucketName,
      ContentType: file.mimetype,
      Key: generateFileName,
    };
    const uploadData = await s3Client.putObject(params).promise();

    if (!uploadData) {
      return res.status(400).json({
        success: false,
        error: "Not able to upload file",
      });
    }

    const post = S3.create({
      bucket: bucketName,
      imageName: generateFileName,
      caption: caption,
    });

    if (!post) {
      return res.status(400).json({
        success: false,
        error: "Not able to post data in db",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data uploaded in bucket successfully",
      data: {
        response: uploadData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const deleteDataFromS3 = async (req, res, next) => {
  const { bucketName, id } = req.params;

  const deleteParams = {
    Bucket: bucketName,
    Key: id,
  };

  try {
    // check in db first if record exists

    const s3Object = await S3.findOne({ where: { imageName: id } });
    if (!s3Object) {
      return res.status(404).json({
        success: false,
        message: `No record found with ID ${id} in db`,
      });
    }

    // now delete from s3

    await s3Client.deleteObject(deleteParams).promise();

    // delete from db
    await s3Object.destroy();

    res.status(200).json({
      success: true,
      message: `Record with ID ${id} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error deleting object from S3",
      details: error.message,
    });
  }
};

export const gets3Objet = async (req, res, next) => {
  const { bucketName, id } = req.params;

  try {
    const s3Object = await S3.findOne({ where: { imageName: id } });
    if (!s3Object) {
      return res.status(404).json({
        success: false,
        message: `No record found with ID ${id} in db`,
      });
    }

    const signedUrl = s3Client.getSignedUrl("getObject", {
      Bucket: bucketName,
      Key: id,
    });

    if (!signedUrl) {
      return res.status(404).json({
        success: false,
        message: `No record found with ID ${id} in bucket`,
      });
    }
    res.status(200).json({
      success: true,
      message: `Record with ID ${id} deleted successfully`,
      data: signedUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching object from S3",
      details: error.message,
    });
  }
};
