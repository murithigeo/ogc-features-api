import { ExegesisContext } from "exegesis-express";
import finalCollections from "../collections.js";
import genCollectionInfo from "../components/collections.js";
import { BaseCollection, Link } from "../types.js";
import selfAltLinks from "../components/links/selfAltLinks.js";
import convertJsonToYAML from "../components/convertToYaml.js";
import throwErrorToExegesis from "../components/utils/throwErrorToExegesis.js";

async function getCollections(ctx: ExegesisContext) {
  try {
    const { url, contentNegotiation } = ctx.params.query.local;
    const _collectionsAll: { collections: BaseCollection[]; links: Link[] } = {
      collections: [],
      links: [],
    };

    for (const collection of finalCollections) {
      ctx.params.query.local.mtColl = collection;
      const res = await genCollectionInfo(ctx.params);
      //@ts-ignore
      _collectionsAll.collections.push(res);
    }
    _collectionsAll.links.push(
      ...(await selfAltLinks(url, contentNegotiation, [
        { f: "JSON", contentType: "application/json" },
        { f: "YAML", contentType: "text/yaml" },
      ]))
    );
    switch (contentNegotiation.f) {
      case "JSON":
        ctx.res
          .status(200)
          .set("content-type", contentNegotiation.contentType)
          .setBody(_collectionsAll);
        break;
      case "YAML":
        ctx.res
          .status(200)
          .set("content-type", contentNegotiation.contentType)
          .setBody(await convertJsonToYAML(_collectionsAll));
        break;
      default:
        throw new Error("400", { cause: "unsupported ct-type" });
    }
  } catch (error) {
    throwErrorToExegesis(ctx, error);
  }
}
async function getCollectionOne(ctx: ExegesisContext) {
  try {
    const localParams = ctx.params.query.local;

    const _collectionDoc = await genCollectionInfo(ctx.params);
    switch (localParams.contentNegotiation.f) {
      case "YAML":
        ctx.res
          .status(200)
          .set("content-type", localParams.contentNegotiation.contentType)
          .setBody(await convertJsonToYAML(_collectionDoc));
        break;
      case "JSON":
        ctx.res.status(200).json(_collectionDoc);
        break;
      default:
        throw new Error("400", { cause: "unsupported content-type" });
    }
  } catch (error) {
    throwErrorToExegesis(ctx, error);
  }
}

const collectionsController = {
  getCollections,
  getCollectionOne,
};

export default collectionsController;
