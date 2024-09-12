import { DataTypes, Sequelize } from "sequelize";

export default function kenyaAdm1Model(sequelize: Sequelize) {
  return sequelize.define(
    "kenya_adm1",
    {
      shapeName: { type: DataTypes.STRING, primaryKey: true },
      shape_Leng: DataTypes.DOUBLE,
      shape_Area: DataTypes.DOUBLE,

      Level: DataTypes.STRING,
      shapeISO: DataTypes.STRING,
      shapeID: DataTypes.STRING,
      shapeGroup: DataTypes.STRING,
      shapeType: DataTypes.STRING,
      geom: DataTypes.GEOMETRY("MULTIPOLYGON", 4326),
    },
    { timestamps: false, freezeTableName: true }
  )
}
