import type { ExegesisContext } from "exegesis-express";
import {
  contenttypes,
  generateOpenApiDoc,
  parseformat,
} from "../utils/index.ts";
import { stringify } from "yaml";

export default {
  getServiceDoc: (ctx: ExegesisContext) => {
    ctx.res
      .set("content-type", "text/html")
      .setBody(generateOpenApiDoc({ url: `/api?f=json` }));
  },
  getServiceDesc: (ctx: ExegesisContext) => {
    const { format } = parseformat(ctx, "JSON", ["JSON", "YAML", "HTML"]);
    let doc = ctx.api.openApiDoc;
    doc = { ...doc, servers: [ctx.api.serverObject] };
    switch (format) {
      case "YAML":
        ctx.res
          .status(200)
          .set("content-type", contenttypes.OPENAPI_YAML)
          .setBody(stringify(doc));
        break;
      case "HTML":
        ctx.res.redirect(302, "/api.html");
        break;
      default:
        ctx.res
          .status(200)
          .set("content-type", contenttypes.OPENAPI_JSON)
          .setBody(doc);
        break;
    }
  },
};
