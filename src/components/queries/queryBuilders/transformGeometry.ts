import { ProjectionAlias, Sequelize } from "sequelize";
import { CrsProperty } from "../../../types.js";
export default async function transformGeometry(
  crsProperty: CrsProperty,
  geomColName: string
): Promise<ProjectionAlias> {
  const transformStatement = Sequelize.fn(
    "ST_Transform",
    Sequelize.col(geomColName),
    crsProperty.srid
  );
  const flipStatement = crsProperty.flipCoords
    ? Sequelize.fn("ST_FlipCoordinates", transformStatement)
    : transformStatement;
  const zAxisStatement = crsProperty.hasZ
    ? Sequelize.fn("St_Force3D", flipStatement)
    : Sequelize.fn("ST_Force2D", flipStatement);
  return [zAxisStatement, geomColName];
}
