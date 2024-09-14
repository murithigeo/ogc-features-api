import { HttpIncomingMessage } from "exegesis-express";
import { NextFunction } from "express";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import { IncomingMessage, ServerResponse } from "http";
export default async function httpLogging(
  req: HttpIncomingMessage,
  res: ServerResponse<IncomingMessage>,
  next: NextFunction
) {
  if (import.meta.env?.MODE !== "production") {
    if (!fs.existsSync(path.join(import.meta.dirname, "/logs.log"))) {
      fs.openSync(path.join(import.meta.dirname, "/logs.log"), "w");
    }

    morgan("combined", {
      stream: fs.createWriteStream(
        path.join(import.meta.dirname, "/logs.log"),
        { flags: "a" }
      ),
    })(req, res, next);
  }
}
