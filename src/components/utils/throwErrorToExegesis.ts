import {
  ExegesisContext,
  ExegesisPluginContext,
  ParameterLocationIn,
} from "exegesis-express";
export default function (
  ctx: ExegesisPluginContext | ExegesisContext,
  name?: string | "f",
  message?: string,
  parameterLocationIn?: ParameterLocationIn
) {
  //console.log(ctx.api.)
  ctx.res.status(400).json(
    ctx.makeValidationError(message || "Unsupported content-type/negotiator", {
      in: parameterLocationIn || "query",
      docPath: ctx.api.pathItemPtr,
      name: name || "f",
    })
  );
}
