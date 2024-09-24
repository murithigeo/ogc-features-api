import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import {
  CrsProperty,
  ExegesisParametersObject,
  FourItemBbox,
  SixItemBbox,
} from "../../types.js";

export function bboxPluginFunction(params: ExegesisParametersObject) {
  const { query } = params;
  const { bbox, "bbox-crs": bboxCrs } = query;
  const bboxParam: FourItemBbox | SixItemBbox = bbox;
  const crsConfig: CrsProperty =
    query.local.bboxCrsProperty ?? query.local.crsProperty;

  if (bboxParam) {
    //    bboxParam.length!==4||bboxParam.length
    if (bboxParam.length !== 4 && bboxParam.length !== 6) {
      throw new Error("400", {
        cause: { message: "Bbox must have 4/6 items" },
      });
    }
    let xy: FourItemBbox;
    let z: [number, number];

    /* //TODO: Current ETS does not differentiate between 3D and 2D bbox
    if (crsConfig.hasZ && bboxParam.length !== 6) {
      throw new Error(`400`, {
        cause: `user sent a 3D bbox alongsde a 2D crs|"bbox-crs"`,
      });
    }
    if (!crsConfig.hasZ && bboxParam.length !== 4) {
      throw new Error(`400`, {
        cause: `user sent a 2D bbox alongside a 3D crs|"bbox-crs"`,
      });
    }
*/
    /*
    xy = crsConfig.hasZ
      ? crsConfig.flipCoords
        ? [bboxParam[1], bboxParam[0], bboxParam[4], bboxParam[3]]
        : [bboxParam[0], bboxParam[1], bboxParam[3], bboxParam[4]]
      : crsConfig.flipCoords
      ? [bboxParam[1], bboxParam[0], bboxParam[3], bboxParam[2]]
      : [bboxParam[0], bboxParam[1], bboxParam[2], bboxParam[3]];

      */
    xy =
      bboxParam.length !== 4
        ? crsConfig.flipCoords
          ? [bboxParam[1], bboxParam[0], bboxParam[4], bboxParam[3]]
          : [bboxParam[0], bboxParam[1], bboxParam[3], bboxParam[4]]
        : crsConfig.flipCoords
        ? [bboxParam[1], bboxParam[0], bboxParam[3], bboxParam[2]]
        : [bboxParam[0], bboxParam[1], bboxParam[2], bboxParam[3]];

    z = bboxParam.length === 6 ? [bboxParam[2], bboxParam[5]] : undefined;

    if (z && z[0] == z[1]) {
      throw new Error(`400`, {
        cause: /*"zmax is lesser than zmin"*/ "U+0394 z must not be 0",
      });
    }
    //! /collections/points/items?bbox=177.0000000%2C65.0000000%2C-177.0000000%2C70.0000000&limit=10  should not return 400 therefore inactivated
    if (xy[0] === xy[2]) {
      throw new Error(`400`, {
        cause: /*"xmax is lesser than xmin"*/ "U+0394 x must be not be 0",
      });
    }
    if (xy[1] === xy[3]) {
      throw new Error(`400`, {
        cause: /*`ymax is lesser than ymin` */ "U+0394 y must be not be 0",
      });
    }
    query.local.bbox = { xy, z };
  }

  return params;
}
