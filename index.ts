import express from "express";
import http from "node:http";
import process from "node:process";
import {
  type ExegesisPlugin,
  type ExegesisPluginContext,
  middleware,
} from "exegesis-express";
import path from "node:path";

import rootcontroller from "./controllers/rootcontroller.ts";
import doccontroller from "./controllers/doccontroller.ts";
import conformancecontroller from "./controllers/conformancecontroller.ts";
import collectionscontroller from "./controllers/collectionscontroller.ts";
import itemscontroller from "./controllers/itemscontroller.ts";

import {
  makeExtraCtx,
  setServerHostname,
  setDatasetConfig,
  crsPlugin,
  paginationPlugin,
  bboxPlugin,
  zPlugin
} from "./utils/index.ts";
import config from "./config.ts";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
  await middleware(path.join(process.cwd(), "openapi.yaml"), {
    controllers: {
      collectionscontroller,
      doccontroller,
      rootcontroller,
      itemscontroller,
      conformancecontroller
    },
    plugins: [
      makeExtraCtx(),
      setServerHostname(),
      ((allowList: string[]): ExegesisPlugin => {
        return {
          info: { name: "exegesis-plugin-unexpectedqueryparams" },
          makeExegesisPlugin() {
            return {
              postSecurity: async (ctx: ExegesisPluginContext) => {
                const url = new URL(ctx.req?.url!, ctx.api.serverObject!.url);
                const validParams = [
                  ...Object.keys((await ctx.getParams()).query),
                  ...allowList,
                ];
                const unexpectedParams = Array.from(
                  url.searchParams.keys()
                ).filter((key) => !validParams.includes(key));
                if (unexpectedParams.length > 0) {
                  throw ctx.makeValidationError(
                    "unexpected query parameters requested",
                    {
                      docPath: ctx.api.pathItemPtr,
                      name: unexpectedParams.join(","),
                      in: "query",
                    }
                  );
                }
              },
            };
          },
        };
      })([]),
      setDatasetConfig(config.datasets),
      crsPlugin(),
      ((): ExegesisPlugin => ({
        info: { name: "exegesis-plugin-bbox-crs" },
        makeExegesisPlugin: () => ({
          postSecurity: async (ctx: ExegesisPluginContext) => {
            const params = await ctx.getParams();
            const dataset: { id: string; crs: Array<string> } =
              ctx["ectx"]["dataset"];
            if (!("bbox-crs" in params.query)) return;
            const bboxCrs =
              params.query["bbox-crs"] ||
              "http://www.opengis.net/def/crs/OGC/1.3/CRS84";
            const value = dataset.crs.find((c) => c === bboxCrs);
            if (!value) {
              throw ctx.makeValidationError(
                `dataset does not support this crs`,
                {
                  in: "query",
                  name: "bbox-crs",
                  docPath: ctx.api.pathItemPtr,
                }
              );
            }
            ctx["ectx"]["bbox-crs"] = value;
          },
        }),
      }))(),
      zPlugin(),
      bboxPlugin("bbox-crs"),
      paginationPlugin(100),
    ],
  })
);
const server = http.createServer(app);
server.listen(PORT, () => console.log(`Listening on ${PORT}`));

export default server;
