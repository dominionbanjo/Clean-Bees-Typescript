import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import errorHandlerMiddleWare from "./middleware/errorHandlerMiddleWare";
import { authenticateUser } from "./middleware/authMiddleware";

const app = express();

//public
import path from "path";
// import { fileURLToPath } from "url";

//routers imports
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME as string,
  api_key: process.env.CLOUD_API_KEY as string,
  api_secret: process.env.CLOUD_API_SECRET as string,
});

//middlewares
app.use(cookieParser(process.env.COOKIE_SECRET as string));
app.use(express.json());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "https://res.cloudinary.com", "data:"],
      // Add other directives as needed
    },
  })
);
app.use(ExpressMongoSanitize());

if ((process.env.NODE_ENV as string) === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(path.resolve(__dirname, "../client/dist")));

app.get("/test", (req: Request, res: Response) => {
  res.json({ msg: "test route" });
});

//routers

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticateUser, userRouter);

app.use("*", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

app.use(errorHandlerMiddleWare);
const port: number = parseInt(process.env.PORT as string, 10) || 5100;

const startServer = async () => {
  try {
    if (process.env.MONGO_URL) {
      await mongoose.connect(process.env.MONGO_URL);
    }
    app.listen(port, () => console.log(`server running on port ${port}...`));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
