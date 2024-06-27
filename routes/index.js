import express from "express";
import bucketApiRouter from "./api.routes.js";

const router = express.Router();

router.use("/bucket", bucketApiRouter);

export default router;
