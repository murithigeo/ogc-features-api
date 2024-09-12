import { Where } from "sequelize/types/utils";
import { Op, Sequelize } from "sequelize";
import { FinalCollectionConfiguration } from "../../../collections.js";
import { CrsProperty, ParsedBbox } from "../../../types.js";

export default async function bboxQueryBuilder(
  bbox: ParsedBbox,
  mtColl: FinalCollectionConfiguration,
  bboxCrsProperty: CrsProperty
) {
  const whereClauses: Where[] = [];
  bbox.xy
    ? whereClauses.push(
        Sequelize.where(
          Sequelize.fn(
            `ST_Intersects`,
            Sequelize.fn(
              `ST_SetSRID`,
              Sequelize.col(mtColl.geometryColumnName),
              mtColl.storageSRID
            ),
            Sequelize.fn(
              `ST_Transform`,
              Sequelize.fn(
                `ST_MakeEnvelope`,
                Sequelize.literal(bbox.xy.join(",")),
                bboxCrsProperty.srid
              ),
              mtColl.storageSRID
            )
          ),
          true
        )
      )
    : undefined;
  bbox.z
    ? whereClauses.push(
        Sequelize.where(
          Sequelize.fn(
            `ST_Z`,
            Sequelize.fn(
              `ST_SetSRID`,
              Sequelize.col(mtColl.geometryColumnName),
              mtColl.storageSRID
            )
          ),
          Op.between,
          bbox.z
        )
      )
    : undefined;
  return whereClauses;
}
