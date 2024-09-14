import {
  ExegesisParametersObject,
} from "../../types.js";
import { FinalCollectionConfiguration } from "../../collections.js";
import crsproperties, { crs84Uri } from "../utils/crsdetails.js";

export default function bboxCrsPluginFunction(
  params: ExegesisParametersObject
) {
  let { "bbox-crs": bboxCrs, local } = params.query;
  const { mtColl }: { mtColl: FinalCollectionConfiguration } = local;
  const bboxCrsParam = bboxCrs ?? crs84Uri;
  
  if ("bbox-crs" in params.query) {
    if (!mtColl.crs.includes(bboxCrsParam)) {
      throw new Error("400", {
        cause: `bbox-crs ${bboxCrsParam} not supported for collection ${mtColl.collectionId}`,
      });
    }
    params.query.local.bboxCrsProperty = crsproperties.find(
      (c) => c.crs === bboxCrsParam
    );
  }
  return params;
}
