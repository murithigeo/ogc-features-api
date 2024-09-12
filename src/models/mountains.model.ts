import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";

export default function pointsModel(
  sequelize: Sequelize
): ModelStatic<Model<any, any>> {
  return sequelize.define(
    "mountains",
    {
      name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      regions: DataTypes.ARRAY(DataTypes.STRING),
      countries: DataTypes.ARRAY(DataTypes.STRING),
      continent: DataTypes.STRING,
      height_ft: DataTypes.DECIMAL,
      height_m: DataTypes.DECIMAL,
      geom: DataTypes.GEOMETRY("PointZ", 4326),
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
}
