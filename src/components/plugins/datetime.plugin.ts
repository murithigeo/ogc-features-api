import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import { ExegesisParametersObject, ParsedDateTime } from "../../types.js";
import dateTimeValidator from "../utils/dateTimeValidator.js";

export default function datetimePluginFunction(
  params: ExegesisParametersObject
): ExegesisParametersObject {
  const { query } = params;
  const { datetime } = query;
  let result: ParsedDateTime = {
    min: undefined,
    in: undefined,
    max: undefined,
  };
  if (datetime) {
    
    let datetimeParam = datetime;
    if (datetimeParam.includes("/")) {
      //i.e: timestamp/timestamp | ../timestamp | timestamp/..
      if (datetimeParam.startsWith("../") || datetimeParam.startsWith("/")) {
        result.max = datetimeParam.split("/")[1]; //../timestamp
      } else if (datetimeParam.endsWith("/..") || datetimeParam.endsWith("/")) {
        result.min = datetimeParam.split("/")[0]; //timestamp/..
      } else {
        result.min = datetimeParam.split("/")[0]; //timestamp/timestamp
        result.max = datetimeParam.split("/")[1];
      }
    } else if (datetimeParam.includes(",")) {
      result.in = datetimeParam.split(",");
    } else {
      result.in = [datetimeParam]; //timestamp
    }
    /**
     * @description validate all entries in the result array to ensure that they are datetimes
     */

    let allDatetimeVals: string[] = [];
    for (let [k, v] of Object.entries(result)) {
      if (v) {
        Array.isArray(v) ? allDatetimeVals.concat(v) : allDatetimeVals.push(v);
        v = Array.isArray(v)
          ? v.map((val) => (val.includes(" ") ? val.replace(" ", "+") : val))
          : v;
        result[k] = v;
        Array.isArray(v) ? (allDatetimeVals = v) : allDatetimeVals.push(v);
      }
    }
    for (const i of allDatetimeVals) {
      if (!dateTimeValidator(i))
        throw new Error(`400`, {
          cause: `Provided date-time is not ISO 8601 compliant`,
        });
    }
  }
  query.datetime = result;
  return params;
}
