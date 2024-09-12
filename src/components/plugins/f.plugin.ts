import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
  ExegesisRoute,
} from "exegesis-express";
import contentNegotiationValues from "../contentNegotiation.js";
import { ExegesisParametersObject } from "../../types.js";

export default function fPluginFunction(
  params: ExegesisParametersObject
): ExegesisParametersObject {
  const { route } = params.query.local;
  const { query } = params;
  const { f, local } = query;
  let fParam = f?? "JSON";
  if (fParam) {
    fParam = fParam.toUpperCase();
    if (
      !contentNegotiationValues.map((val) => val.f as string).includes(fParam)
    ) {
      throw new Error("400", {
        cause: `Unsupported content negotiator present`,
      });
    }
    query.local.contentNegotiation =
      ![
        "/",
        "/api",
        "/api.html",
        "/conformance",
        "/collections",
        "/collections/{collectionId}",
      ].includes(route.path) && fParam === "JSON"
        ? { f: "GEOJSON", contentType: "application/geo+json" }
        : contentNegotiationValues.find((f) => f.f === fParam);
  }
  return params;
}
