import {
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import {
  CollectionConfiguration,
  ExegesisParametersObject,
} from "../../types.js";
import { FinalCollectionConfiguration } from "../../collections.js";
import crsproperties, { crs84Uri } from "../utils/crsdetails.js";

export default function CrsPluginFunction(params: ExegesisParametersObject) {
  let { crs, local } = params.query;
  const { mtColl }: { mtColl: FinalCollectionConfiguration } = local;
  const crsParam = crs ?? crs84Uri;
  if ("crs" in params.query) {
    if (!mtColl.crs.includes(crsParam)) {
      throw new Error("400", {
        cause: `CRS ${crs} not supported for collection ${mtColl.collectionId}`,
      });
    }
    const currentCrs = crsproperties.find((c) => c.crs === crsParam);
    params.query.local.crsProperty = currentCrs;

    params.query.local.contentCrs = `<${currentCrs.crs}>`;
  }
  return params;
}
