import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import { ExegesisParametersObject } from "../../types.js";

export default function offsetLimitPluginFunction(
  params: ExegesisParametersObject
): ExegesisParametersObject {
  const { query } = params;
  const { offset, limit, local } = query;
  if (offset) {
    local.offset = offset < 0 ? 0 : offset;
  }
  if (limit) {
    local.limit = limit < 0 ? 0 : limit;
  }
  return params;
}
