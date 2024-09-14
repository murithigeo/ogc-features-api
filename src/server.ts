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
import httpLogging from "./components/httpLogging/index.js";
const PORT = process.env.PORT || 10000;
async function createServer() {
  const app = express();
  app.use(cors());
  app.use(httpLogging);
  app.use(
    rateLimit({ windowMs: 10 * 60 * 1000, skipFailedRequests: true, limit: 1000 })
  );
  app.use((req, res, next) => {
    req.url = decodeURIComponent(req.url);
    console.log("Decoded URL: ", req.url);
    console.log("statusCode: ", res.statusCode);
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
    allErrors: true,
    plugins: [ allPlugin(),unexpectedQueryParametersPlugin([])],
  });
  app.use(middleware);
  return http.createServer(app);
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
