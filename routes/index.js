import express from "express";
import apiRouter from "./api.routes.js"

const router = express.Router();

router.use("/", apiRouter);

export default router;