import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

const S3 = sequelize.define("s3post", {
  bucket: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  caption: {
    type: DataTypes.STRING,
  },
});

S3.sync().then(() => {
  console.log("table created");
});

export default S3;
