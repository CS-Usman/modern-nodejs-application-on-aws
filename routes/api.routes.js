import express from "express";
import {test} from "../controllers/api.controller.js";

const apiRouter = express.Router();

apiRouter.get("/",test);

export default apiRouter;