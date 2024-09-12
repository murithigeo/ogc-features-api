import { Sequelize } from "sequelize";
import { Models } from "../../models/index.js";

/**
 *
 * @param sequelize
 * @param modelName
 * @param instanceIdColumn
 * @param instanceId
 * @returns  [number, number, number, number, number, number][]
 */
export default async function querySpatialBbox(
  models: Models,
  geomColName: string,
  modelName: string
): Promise<[number, number, number, number, number, number][]> {
  let extentSpatialBbox: [number, number, number, number, number, number][] = [
    [180, 90, 0, 180, 90, 0],
  ];
  try {
    extentSpatialBbox = [
      (
        (await models[modelName].findOne({
          attributes: [
            [
              Sequelize.literal(
                `ARRAY[
                      ST_XMin(ST_3DExtent(${geomColName})),
                      ST_YMin(ST_3DExtent(${geomColName})),
                      ST_ZMin(ST_3DExtent(${geomColName})),
                      ST_XMax(ST_3DExtent(${geomColName})),
                      ST_YMax(ST_3DExtent(${geomColName})),
                      ST_ZMax(ST_3DExtent(${geomColName}))
                    ]`
              ),
              "bbox",
            ],
          ],
          raw: true,
        })) as any
      ).bbox,
    ] as [number, number, number, number, number, number][];
    return extentSpatialBbox;
  } catch (err) {
    console.log(err);
    return extentSpatialBbox;
  }
}
