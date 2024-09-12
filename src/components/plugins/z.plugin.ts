import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import { ExegesisParametersObject, ParsedZ } from "../../types.js";
import throwErrorToExegesis from "../throwErrorToExegesis.js";

export default function zPluginFunction(
  params: ExegesisParametersObject
): ExegesisParametersObject {
  const { query } = params;
  let zParam = query.z as string;
  if (zParam) {
    zParam = zParam.toUpperCase();
    let newZ: ParsedZ = {
      max: undefined,
      min: undefined,
      in: undefined,
    };
    if (zParam.startsWith("R")) {
      //input R10/20/30
      //After removing R & splitting [10,20,30]
      const parsedZ = zParam
        .substring(1)
        .split("/")
        .filter((z) => z !== "");
      for (const i of parsedZ) {
        if (isNaN(Number(i)))
          throw new Error(`400`, { cause: `Invalid schema` });
      }
      newZ.in = [];
      for (
        //Generate intervals using the param provided
        let i = parseFloat(parsedZ[1]);
        i <=
        parseFloat(parsedZ[1]) +
          parseFloat(parsedZ[0]) * parseFloat(parsedZ[2]);
        i += parseFloat(parsedZ[2])
      ) {
        newZ.in.push(i);
      }
    } else if (zParam.includes("/")) {
      const parsedZ = zParam
        .split("/")
        .filter((z) => z !== "")
        .map((z) => {
          if (Number.isNaN(Number(z))) {
            throw new Error(`400`, { cause: `Invalid schema` });
          }
          return parseFloat(z);
        });
      if (parsedZ.length !== 2) {
        throw new Error(`400`, {
          cause: `Items in interval exceeded schema||param includes non-eligible strings`,
        });
      }
      newZ.min = parsedZ[0];
      newZ.max = parsedZ[1];
    } else if (zParam.includes(",")) {
      const parsedZ = zParam
        .split(",")
        .filter((z) => z !== "")
        .map((z) => {
          if (Number.isNaN(Number(z))) {
            throw new Error(`400`, { cause: `Invalid schema` });
          }
          return parseFloat(z);
        });
      newZ.in = parsedZ;
    } else {
      if (isNaN(Number(zParam))) {
        throw new Error(`400`, { cause: "Invalid schema" });
      }
      newZ.in = [parseFloat(zParam)];
    }

    query.local.z = newZ as ParsedZ;
  }
  return params;
}
