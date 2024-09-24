import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import { bboxPluginFunction } from "./bbox.plugin.js";
import bboxCrsPluginFunction from "./bboxcrs.plugin.js";
import collectionIdMatching from "./collection.plugin.js";
import fPluginFunction from "./f.plugin.js";
import datetimePluginFunction from "./datetime.plugin.js";
import CrsPluginFunction from "./crs.plugin.js";
import zPluginFunction from "./z.plugin.js";
import offsetLimitPluginFunction from "./offset_limit.plugin.js";
import throwErrorToExegesis from "../utils/throwErrorToExegesis.js";

function makeExegesisPlugin(data: { apiDoc: any }): ExegesisPluginInstance {
  return {
    postSecurity: async (ctx: ExegesisPluginContext) => {
      try {
        let params = await ctx.getParams();
        params.query.local = {};
        //@ts-expect-error
        const route = ctx.route as ExegesisRoute;

        params.query.local.url = new URL(
          ctx.api.serverObject.url + ctx.req.url
        );

        params.query.local.route = route;

        //collectionplugin
        params = collectionIdMatching(params);

        //crsplugin
        params = CrsPluginFunction(params);

        //bboxcrsplugin
        params = bboxCrsPluginFunction(params);

        //bboxcrs
        params = bboxPluginFunction(params);
        //bboxplugin
        params = bboxPluginFunction(params);

        //bboxcrsplugin
        params = bboxCrsPluginFunction(params);

        //fPlugin
        params = fPluginFunction(params);

        //datetime
        params = datetimePluginFunction(params);

        //zplugin
        params = zPluginFunction(params);

        //offsetlimitplugin
        params = offsetLimitPluginFunction(params);
      } catch (error) {
        console.log(error);
        let errCode = parseInt(error.message);
        errCode = !isNaN(errCode) ? errCode : 500;
        ctx.res.status(errCode).json(
          errCode === 400
            ? ctx.makeValidationError(error.cause.message || error.cause, {
                in: "query",
                name: error.cause.name || error.cause,
                docPath: ctx.api.pathItemPtr,
              })
            : ctx.makeError(errCode, error.cause)
        );
      }
    },
  };
}

export default function allPlugin(): ExegesisPlugin {
  return {
    info: {
      name: "exegesis-plugin-all",
    },
    makeExegesisPlugin(data) {
      return makeExegesisPlugin(data);
    },
  };
}
