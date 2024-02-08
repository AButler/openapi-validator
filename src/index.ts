import express, { NextFunction, Request, Response } from "express";
import expressWinston from "express-winston";
import winston from "winston";
import multer from "multer";
import cors from "cors";
import { validate, validateUploads } from "./apis/validate";

console.log("Starting...");

const app = express();
const upload = multer();
const port = 3000;

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.json(),
  })
);
app.use(cors());

app.get("/health", (_: Request, res: Response) => {
  res.send("Healthy");
});

app.post("/validate", validateUploads(upload), validate);

app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.json(),
  })
);

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  res.status(500).send("Internal Server Error");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
