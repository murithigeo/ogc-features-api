import { ExegesisContext } from "exegesis-express";
import { FindAttributeOptions, Op, Sequelize, WhereOptions } from "sequelize";
import bboxQueryBuilder from "./bbox.js";

import nonNullGeometryFilter from "./nonNullGeometryFilter.js";
import dateTimeQueryBuilder from "./datetime.js";
import transformGeometry from "./transformGeometry.js";
import itemIdQueryBuilder from "./itemId.js";
import zQueryBuilder from "./z.js";
import crsproperties from "../../utils/crsdetails.js";
import { FinalCollectionConfiguration } from "../../../collections.js";
import { ExegesisParametersObject, LocalParams } from "../../../types.js";
import { Locals } from "express";

export default async function geometryQueryBuilders(
  xparams: ExegesisParametersObject
): Promise<{ attributes: FindAttributeOptions; where: WhereOptions<any> }> {
  const {
    bbox,
    datetime,
    crsProperty,
    z,
    bboxCrsProperty,
    mtColl,
  }: LocalParams = xparams.query.local;
  const queryElevation: boolean = crsproperties.find(
    (el) => el.code === mtColl.storageCrsCode
  ).hasZ;
  const queries = {
    attributes: {
      exclude: [mtColl.geometryColumnName],
      include: [
        await transformGeometry(
          crsProperty,
          (mtColl as FinalCollectionConfiguration).geometryColumnName
        ),
      ],
    },
    where: {
      [Op.and]: [
        xparams.path.featureId
          ? await itemIdQueryBuilder(mtColl.pKeyColumn, xparams.path.featureId)
          : undefined,
        ...(bbox
          ? await bboxQueryBuilder(bbox, mtColl, bboxCrsProperty)
          : [undefined]),
        await nonNullGeometryFilter(mtColl.geometryColumnName),

        ...(datetime && mtColl.datetimeColName
          ? await dateTimeQueryBuilder(mtColl.datetimeColName, datetime)
          : [undefined]),
        xparams.path.itemId
          ? await itemIdQueryBuilder(mtColl.pKeyColumn, xparams.path.itemId)
          : undefined,
        ...(z && queryElevation
          ? await zQueryBuilder(z, mtColl.storageSRID, mtColl.geometryColumnName)
          : [undefined]),
      ].filter((query) => !!query),
    },
  };
  //console.log(JSON.stringify(queries));
  return queries;
}
