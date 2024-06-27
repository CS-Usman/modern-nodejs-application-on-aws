import express from "express";
import {
  createS3Bucket,
  listAllBuckets,
  uploadDataToS3,
  deleteDataFromS3,
  gets3Objet,
} from "../controllers/api.controller.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const bucketApiRouter = express.Router();

bucketApiRouter.post("/", createS3Bucket);
bucketApiRouter.get("/", listAllBuckets);
bucketApiRouter.get("/:bucketName/:id", gets3Objet);

bucketApiRouter.post("/upload", upload.single("data"), uploadDataToS3);
bucketApiRouter.delete("/delete-object/:bucketName/:id", deleteDataFromS3);

export default bucketApiRouter;
