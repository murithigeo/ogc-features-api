import { Sequelize, DataTypes } from "sequelize";

export default function usersModel(sequelize: Sequelize) {
  return sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      apikey: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["admin", "user"]],
        },
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );
}
