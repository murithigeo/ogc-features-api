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
const PORT = process.env.PORT || 80;
const doc = loadOpenApiDoc();
async function createServer() {
  const app = express();
  app.use(cors());
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000,
      skipFailedRequests: true,
      limit: parseInt(process.env.RATE_LIMIT) || 200,
    })
  );
  app.use((req, res, next) => {
    req.url = decodeURIComponent(req.url);
    next();
  });
  process.env.NODE_ENV !== "production" ? app.use(httpLogging) : null;

  const middleware = await exegesisExpress.default(doc, {
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
    plugins: [unexpectedQueryParametersPlugin([]), allPlugin()],
  });
  app.use(middleware);
  return http.createServer(app);
}
createServer()
  .then((server) =>
    server.listen(PORT, () =>
      doc.servers.forEach((s) => {
        console.log(
          `server listening: ${server.listening} on address: ${s.url}`
        );
      })
    )
  )
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
