import { Where } from "sequelize/types/utils";
import { Op, Sequelize, WhereOptions } from "sequelize";
import { ParsedZ } from "../../../types.js";

export default async function zQueryBuilder(
  z: ParsedZ,
  storageSRID: number,
  geomColName: string
) {
  const whereClauses: Where[] & WhereOptions[] = [];
  if (z.in) {
    whereClauses.push(
      Sequelize.where(
        Sequelize.fn(
          "ST_Z",
          Sequelize.fn("ST_SetSRID", Sequelize.col(geomColName), storageSRID)
        ),
        Op.in,
        //[...z.in]
        Sequelize.literal(`(${z.in})`)
      )
    );
  }
  if (z.min && z.max) {
    whereClauses.push(
      Sequelize.where(
        Sequelize.fn(
          "ST_Z",
          Sequelize.fn("ST_SetSRID", Sequelize.col(geomColName), storageSRID)
        ),
        Op.between,
        [z.min, z.max]
      )
    );
  }
  if (z.max && !z.min) {
    whereClauses.push(
      Sequelize.where(
        Sequelize.fn(
          "ST_Z",
          Sequelize.fn("ST_SetSRID", Sequelize.col(geomColName), storageSRID)
        ),
        Op.lte,
        z.max
      )
    );
  }
  if (!z.max && z.min) {
    whereClauses.push(
      Sequelize.where(
        Sequelize.fn(
          "ST_Z",
          Sequelize.fn("ST_SetSRID", Sequelize.col(geomColName), storageSRID)
        ),
        Op.gte,
        z.min
      )
    );
  }
  return whereClauses;
}
