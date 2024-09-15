import { Model, ModelStatic, Op, Sequelize } from "sequelize";
import pointsModel from "./mountains.model.js";
import usersModel from "./users.model.js";
let sequelize = new Sequelize({
  password: process.env?.DB_PASSWORD ?? "postgres",
  username: process.env?.DB_USERNAME ?? "postgres",
  database: process.env?.DB_NAME ?? "postgres",
  define: {
    //paranoid: true,
    freezeTableName: true,
  },
  host: process.env?.DB_HOST ?? "localhost",
  dialect: "postgres",
  ssl: process.env?.MODE !== "production" ? false : true,
  logQueryParameters: true,
  logging(sql){
       console.log(sql)
  }
});

//Init models
/*
const files = fs.readdirSync(import.meta.dirname).filter((file) => {
  // Change import.meta.dirname to fileURLToPath(import.meta.url)
  //console.log(file)
  return (
    file.indexOf(".") &&
    //file !== "index.ts" &&
    file !== "srs.model.ts" &&
    file.slice(-9) === ".model.ts"
  );
});

for (const file of files) {
  const model = (
    await import(pathToFileURL(path.join(import.meta.dirname, file)).href)
  ).default(sequelize);
  sequelize.models[model.name] = model;
}
*/
//sequelize.sync({ force: true });
//kenyaAdm1Model(sequelize).sync({ force: true });
export type Models = { [key: string]: ModelStatic<Model<any, any>> };
const models: Models = {
  mountains: pointsModel(sequelize),
  users: usersModel(sequelize),
  //kenya_adm1: kenyaAdm1Model(sequelize),
  //polygons: polygonModel(sequelize)
};
export default models;
