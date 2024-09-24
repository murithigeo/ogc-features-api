import { ExegesisContext } from "exegesis-express";
import queryAsGeoJson from "../components/queries/queryAsGeoJson.js";
import geoJsonParsers from "../components/geoJsonParsers.js";
import convertJsonToYAML from "../components/convertToYaml.js";
import throwErrorToExegesis from "../components/utils/throwErrorToExegesis.js";
import models from "../models/index.js";
import selfAltLinks from "../components/links/selfAltLinks.js";
import geojsonFeatureLinks from "../components/links/geojsonFeatureLinks.js";

async function queryAllItems(ctx: ExegesisContext) {
  try {
    const { contentNegotiation, url, contentCrs,limit,offset } = ctx.params.query.local;
    const dbRes = await queryAsGeoJson.getRowsPlusCount(models, ctx.params);
    const featurecollection = await geoJsonParsers.toBaseFeatureCollection(
      ctx.params,
      dbRes.rows,
      dbRes.count,
      [
        { f: "GEOJSON", contentType: "application/geo+json" },
        { f: "YAML", contentType: "text/yaml" },
      ]
    );
    switch (contentNegotiation.f) {
      case "JSON":
      case "GEOJSON":
        ctx.res
          .status(200)
          .set("content-type", "application/geo+json")
          .set("content-crs", contentCrs)
          .setBody(featurecollection);
        //.end();
        break;
      case "YAML":
        ctx.res
          .status(200)
          .set("content-crs", contentCrs)
          .set("content-type", contentNegotiation.contentType)
          .setBody(await convertJsonToYAML(featurecollection));
        //.end();
        break;
      default:
        throw new Error("400", { cause: "unsupported ct-typ" });
    }
  } catch (error) {
    throwErrorToExegesis(ctx, );
  }
}

async function querySpecificItem(ctx: ExegesisContext) {
  try {
    const { contentCrs, contentNegotiation, url } = ctx.params.query.local;
    const dbRes = await queryAsGeoJson.getOneRow(models, ctx.params);
    if (!dbRes) {
      throw new Error("404", { cause: "No data found" });
    }
    let links = await selfAltLinks(url, contentNegotiation, [
      { f: "GEOJSON", contentType: "application/geo+json" },
      { f: "YAML", contentType: "text/yaml" },
    ]);
    const additionalLinks = await geojsonFeatureLinks(
      links.find((l) => l.rel === "self")
    );
    links.push(...additionalLinks);
    const feature = await geoJsonParsers.toFeature(
      dbRes,
      ctx.params.query.local.mtColl
    );
    feature.links = links;
    //console.log(links);
    switch (contentNegotiation.f) {
      case "GEOJSON":
        ctx.res
          .status(200)
          .set("content-crs", contentCrs)
          .set("content-type", `application/geo+json`)
          .setBody(feature);
        break;
      case "YAML":
        ctx.res
          .status(200)
          .set("content-type", contentNegotiation.contentType)
          .setBody(await convertJsonToYAML(feature));
        break;
      default:
        throw new Error("400", { cause: "unsupported ct-typ" });
    }
  } catch (error) {
    throwErrorToExegesis(ctx, );
  }
}

const itemsController= { queryAllItems, querySpecificItem };
export default itemsController;
