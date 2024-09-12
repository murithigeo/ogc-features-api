import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";

function makeExegesisPlugin(data: { apiDoc: any }): ExegesisPluginInstance {
  return {
    postSecurity: async (ctx: ExegesisPluginContext) => {
      const reqUrl = new URL(ctx.api.serverObject.url + ctx.req.url);
      const { query } = await ctx.getParams();
      query.local = {
        url: reqUrl.href,
      };
    },
  };
}

export default function currentUrlPlugin(): ExegesisPlugin {
  return {
    info: {
      name: "exegesis-plugin-current-url",
    },
    makeExegesisPlugin(data) {
      return makeExegesisPlugin(data);
    },
  };
}
