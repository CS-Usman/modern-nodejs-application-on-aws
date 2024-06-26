import express from "express";
import "dotenv/config";
import router from "./routes/index.js";
import connectDB from "./config/db.config.js";

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use("/", router);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
