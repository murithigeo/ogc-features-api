import type { ExegesisContext } from "exegesis";
import { parseformat, Links, type LandingPage } from "../utils/index.ts";

export default {
  getLandingPage: (ctx: ExegesisContext) => {
    const { output_formats } = parseformat(ctx, "JSON", ["JSON", "HTML"]);
    const doc: LandingPage = {
      title: "OGC API Features Implementation",
      links: new Links(ctx)
        .self()
        .alternates(output_formats)
        .serviceDoc()
        .serviceDesc()
        .collections()
        .conformance().links,
    };

    ctx.res.status(200).setBody(doc);
  },
};
