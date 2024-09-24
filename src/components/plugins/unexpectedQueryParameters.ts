import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import throwErrorToExegesis from "../utils/throwErrorToExegesis.js";

function makeExegesisPlugin(
  data: { apiDoc: any },
  undocumentedQueryParamsToIgnore: string[]
): ExegesisPluginInstance {
  return {
    postSecurity: async (ctx: ExegesisPluginContext) => {
      const reqUrl = new URL(ctx.api.serverObject.url + ctx.req.url);
      const oasListedQueryParams = (await ctx.getParams()).query;
      //Access all params present on req.url
      const allQueryParams = Array.from(
        new URLSearchParams(reqUrl.search).keys()
      );

      const allowedQueryParams: string[] = []
        .concat(Object.keys(oasListedQueryParams))
        .concat(undocumentedQueryParamsToIgnore);

      const unexpectedParams = allQueryParams.filter(
        (param) => !allowedQueryParams.includes(param)
      );

      if (unexpectedParams.length > 0) {
        ctx.res.status(400).json(
          ctx.makeValidationError("unexpected query parameters sent", {
            in: "query",
            name: unexpectedParams.join(","),
            docPath: ctx.api.pathItemPtr,
          })
        );
      }
    },
  };
}

export default function unexpectedQueryParametersPlugin(
  queryParamsToIgnore: string[]
): ExegesisPlugin {
  return {
    info: {
      name: "exegesis-plugin-unexpected-query-parameters",
    },
    makeExegesisPlugin(data) {
      return makeExegesisPlugin(data, queryParamsToIgnore);
    },
  };
}
