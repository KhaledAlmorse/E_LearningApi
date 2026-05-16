import mongoose from "mongoose";
import chalk from "chalk";

export const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log(chalk.blue(`DataBase Connected Successfully`));
    })
    .catch((err) => {
      console.error(chalk.red(`Database Connection Failed: ${err.message}`));
      process.exit(1);
    });
};

export default connectDB;
