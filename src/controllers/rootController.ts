import { ExegesisContext } from "exegesis-express";
import rootLinks from "../components/links/root.js";
import throwErrorToExegesis from "../components/utils/throwErrorToExegesis.js";
import convertJsonToYAML from "../components/convertToYaml.js";

async function getRoot(ctx: ExegesisContext) {
  try {
    const { url, contentNegotiation } = ctx.params.query.local;
    const rootDocument: { [key: string]: any } = {
      title: `OGC Features API implementation`,
      links: await rootLinks(url, contentNegotiation, [
        { f: "JSON", contentType: "application/json" },
        { f: "YAML", contentType: "text/yaml" },
      ]),
    };
    switch (contentNegotiation.f) {
      case "JSON":
        ctx.res
          .status(200)
          .set("content-type", "application/json")
          .setBody(rootDocument);
        break;
      case "YAML":
        ctx.res
          .status(200)
          .set("content-type", "text/yaml")
          .setBody(await convertJsonToYAML(rootDocument));
        break;
      default:
        throw new Error("400", { cause: "unsupported ct-type" });
    }
  } catch (error) {
    throwErrorToExegesis(ctx, error);
  }
}


const rootController = {
  getRoot
};

export default rootController;