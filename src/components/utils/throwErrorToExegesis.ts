import { ExegesisContext, ExegesisPluginContext } from "exegesis-express";
import httpMessages from "./httpMessages.js";

export default function throwErrorToExegesis(
  ctx: ExegesisPluginContext | ExegesisContext,
  err: any
) {
  const errCode = parseInt(err.message);
  console.log(err);
  if (!Number.isNaN(errCode)) {
    ctx.res
      .status(errCode)
      .pureJson({
        ...httpMessages[errCode],
        cause: err.cause,
        status: errCode,
      })
      .end();
  } else {
    ctx.res
      .status(500)
      .pureJson({
        ...httpMessages[500],
        //cause: err,
        status: 500,
      })
      .end();
  }
  return;
}
