import { ExegesisContext } from "exegesis-express";
//import { apiDoc } from "../server.js";
import convertJsonToYAML from "../components/convertToYaml.js";
import throwErrorToExegesis from "../components/utils/throwErrorToExegesis.js";
import genScalarUi from "../components/utils/scalarUi.js";
import loadOpenApiDoc from "../openapi/loadOpenApiDoc.js";
const apiDoc = loadOpenApiDoc();
async function getServiceDoc(ctx: ExegesisContext) {
  const scalarCode = await genScalarUi(apiDoc);
  ctx.res.status(200).set(`Content-type`, "text/html").setBody(scalarCode);
}

async function getServiceDesc(ctx: ExegesisContext) {
  try {
    const contentNegotiation = ctx.params.query.local.contentNegotiation;
    switch (contentNegotiation.f) {
      case "JSON":
        ctx.res
          .status(200)
          .set("content-type", "application/vnd.oai.openapi+json;version=3.0")
          .setBody(apiDoc);
        break;
      case "YAML":
        ctx.res
          .status(200)
          .set(`content-type`, contentNegotiation.contentType)
          .setBody(await convertJsonToYAML(apiDoc));
        break;
      default:
        throw new Error("400", { cause: "unsupported ct-type" });
    }
  } catch (error) {
    throwErrorToExegesis(ctx, error);
  }
}

const apiController = { getServiceDesc, getServiceDoc };

export default apiController;
