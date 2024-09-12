import { Sequelize } from "sequelize";
import { Models } from "../../models/index.js";
/**
 *
 * @param sequelize
 * @param modelName
 * @param datetimeColName
 * @param instanceIdColumn
 * @param instanceId
 * @returns [string | null, string | null][]
 */
export default async function queryTemporalInterval(
  models: Models,
  modelName: string,
  datetimeColName: string
): Promise<[string | null, string | null][]> {
  const intervals: [string | null, string | null][] = [];
  if (datetimeColName) {
    try {
      intervals.push([
        (await models[modelName].min(datetimeColName)) as string,
        (await models[modelName].max(datetimeColName)) as string,
      ]);
    } catch (error) {
      intervals.push([null, null]);
    }

    //intervals.push([min as string, max as string]);
  } else {
    //Push null vals if datetime columns are undefined
    intervals.push([null, null]);
  }
  return intervals;
}
