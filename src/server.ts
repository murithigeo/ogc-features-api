import cors from "cors";
import exegesisExpress from "exegesis-express";
import express from "express";
import ApiKeyAuth from "./authentication/ApiKeyAuth.js";
import BasicAuth from "./authentication/BasicAuth.js";
import http from "http";
import unexpectedQueryParametersPlugin from "./components/plugins/unexpectedQueryParameters.js";
import rootController from "./controllers/rootController.js";
import apiController from "./controllers/apiController.js";
import conformanceController from "./controllers/conformanceController.js";
import itemsController from "./controllers/itemsController.js";
import collectionsController from "./controllers/collectionsController.js";
import allPlugin from "./components/plugins/all.plugin.js";
import rateLimit from "express-rate-limit";
import loadOpenApiDoc from "./openapi/loadOpenApiDoc.js";
const PORT = parseInt(import.meta.env?.VITE_PORT) || 3000;
console.log(import.meta.env);
async function createServer() {
  const app = express();
  app.use(cors());
  app.use(rateLimit({ windowMs: 10 * 60 * 1000, skipFailedRequests: true }));
  app.use((req, res, next) => {
    req.url = decodeURIComponent(req.url);
    next();
  });
  const middleware = await exegesisExpress.default(loadOpenApiDoc(), {
    controllers: {
      rootController,
      apiController,
      conformanceController,
      itemsController,
      collectionsController,
    },
    ignoreServers: false,
    authenticators: {
      ApiKeyAuth,
      BasicAuth,
    },
    allowMissingControllers: false,
    autoHandleHttpErrors: true,
    plugins: [unexpectedQueryParametersPlugin([]), allPlugin()],
  });
  app.use(middleware);
  return http.createServer(app);
}
if (isNaN(PORT)) {
  console.error("Invalid port number in .env file" + PORT);
  process.exit(1);
}

createServer()
  .then((server) =>
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    })
  )
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
