import { Where } from "sequelize/types/utils";
import { Op, Sequelize, WhereOperators } from "sequelize";
import { ParsedDateTime } from "../../../types.js";

export default async function dateTimeQueryBuilder(
  datetimeColName: string,
  datetime: ParsedDateTime
) {
  let whereClauses: WhereOperators[] & Where[] = [];
  if (datetime.min && datetime.max) {
    whereClauses.push(
      Sequelize.where(Sequelize.col(datetimeColName), Op.between, [
        datetime.min,
        datetime.max,
      ])
    );
  }
  if (datetime.in) {
    whereClauses.push({
      [datetimeColName]: {
        [Op.in]: datetime.in,
      },
    });
  }
  if (!datetime.min && datetime.max) {
    whereClauses.push(
      Sequelize.where(Sequelize.col(datetimeColName), Op.lte, datetime.max)
    );
  }
  if (!datetime.max && datetime.min) {
    whereClauses.push(
      Sequelize.where(Sequelize.col(datetimeColName), Op.gte, datetime.min)
    );
  }
  return whereClauses;
}
