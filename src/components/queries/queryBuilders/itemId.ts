import { Op, Sequelize } from "sequelize";

export default async function itemIdQueryBuilder(
  pKeyColumn: string,
  itemId: string,
) {
  return {
    [pKeyColumn]: {
      [Op.eq]: itemId,
    },
  };
}
