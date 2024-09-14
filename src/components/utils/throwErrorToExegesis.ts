import { ExegesisContext, ExegesisPluginContext } from "exegesis-express";
import httpMessages from "./httpMessages.js";

export default function throwErrorToExegesis(
  ctx: ExegesisPluginContext | ExegesisContext,
  err: any
) {
  //fix Trying to set status after response has been ended.
  if (ctx.isResponseFinished()) {
    console.log("Error: ", err);
    console.log("response finished: ", ctx.isResponseFinished());
    const errCode = parseInt(err.message);
    console.log(err);
    if (Number.isInteger(errCode)) {
      ctx.res.status(errCode).pureJson({
        ...httpMessages[errCode],
        cause: err.cause,
        status: errCode,
      });
    } else {
      ctx.res.status(500).pureJson({
        ...httpMessages[500],
        //cause: err,
        status: 500,
      });
    }
  }
}
