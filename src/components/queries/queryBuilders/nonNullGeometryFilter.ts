import { Op } from "sequelize";

export default async function nonNullGeometryFilter(geomColName: string) {
  return {
    [geomColName]: {
      [Op.ne]: null,
    },
  };
}
