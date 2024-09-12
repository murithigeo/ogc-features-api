import { Model, ModelStatic, Sequelize } from "sequelize";
import { ExegesisParametersObject } from "../../types.js";
import geometryQueryBuilders from "./queryBuilders/index.js";
import { Models } from "../../models/index.js";

async function getOneRow(
  models: Models,
  xparams: ExegesisParametersObject
): Promise<Model<any, any>> {
  const { mtColl } = xparams.query.local;
  return await models[mtColl.modelName].findOne({
    ...(await geometryQueryBuilders(xparams)),
    raw: true,
  });
}

/**
 * Suitable for CoverageJSON which does not require count
 * @param sequelize
 * @param xparams
 * @returns
 */
async function getRowsWithoutCount(
  models: Models,
  xparams: ExegesisParametersObject
): Promise<{
  rows: Model<any, any>[];
  count: number;
}> {
  const { mtColl, limit, offset } = xparams.query.local;
  return await models[mtColl.modelName].findAndCountAll({
    ...(await geometryQueryBuilders(xparams)),
    limit,
    offset,
    raw: true,
    order: [[mtColl.pKeyColumn, "ASC"]],
  });
}

/**
 * Suitable for GEOJSON
 * @param sequelize
 * @param xparams
 * @returns rows and count
 */

async function getRowsPlusCount(
  models:Models,
  xparams: ExegesisParametersObject
): Promise<{ rows: Model<any, any>[]; count: number }> {
  const { mtColl, limit, offset } = xparams.query.local;
  return await models[mtColl.modelName].findAndCountAll({
    ...(await geometryQueryBuilders(xparams)),
    limit,
    offset,
    raw: true,
    order: [[mtColl.pKeyColumn, "ASC"]],
  });
}

const queryAsGeoJson = {
  getRowsPlusCount,
  getRowsWithoutCount,
  getOneRow,
};

export default queryAsGeoJson;
