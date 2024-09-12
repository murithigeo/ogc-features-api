import { ExegesisContext } from "exegesis-express";
import { Link } from "../types.js";
import selfAltLinks from "../components/links/selfAltLinks.js";
import convertJsonToYAML from "../components/convertToYaml.js";
import throwErrorToExegesis from "../components/utils/throwErrorToExegesis.js";

const conformanceController = {
  getConformance: async function getConformance(ctx: ExegesisContext) {
    try {
      const { url, contentNegotiation } = ctx.params.query.local;
      const conformanceDoc: { conformsTo: string[]; links: Link[] } = {
        conformsTo: [
          "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core",
          "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30",
          "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson",
          "http://www.opengis.net/spec/ogcapi-features-2/1.0/conf/crs",
        ],
        links: await selfAltLinks(url, contentNegotiation, [
          { f: "JSON", contentType: "application/json" },
          { f: "YAML", contentType: "text/yaml" },
        ]),
      };
      switch (contentNegotiation.f) {
        case "JSON":
          ctx.res.status(200).json(conformanceDoc);
          break;
        case "YAML":
          ctx.res
            .status(200)
            .set(`content-type`, contentNegotiation.contentType)
            .setBody(await convertJsonToYAML(conformanceDoc));
          break;
        default:
          throw new Error("400", { cause: "unsupported content-type neg" });
      }
    } catch (error) {
      throwErrorToExegesis(ctx, error);
    }
  },
};


export default conformanceController;