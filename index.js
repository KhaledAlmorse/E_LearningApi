import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import chalk from "chalk";
import bootstrap from "./src/modules/app.controller.js";

dotenv.config();
const app = express();
app.use(morgan("dev"));

await bootstrap(app, express);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    chalk.blue(
      `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode ${process.env.API_VERSION}`,
    ),
  );
});
