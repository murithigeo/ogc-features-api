import {
  BaseGeoJsonFeature,
  BaseGeoJsonFeatureCollection,
  CTInterface,
  ExegesisParametersObject,
} from "../types.js";
import { FinalCollectionConfiguration } from "../collections.js";
import selfAltLinks from "./links/selfAltLinks.js";
import featureCollectionLinks from "./links/geojsonFeatureCollectionLinks.js";

async function toFeature(
  row: { [key: string]: any },
  mtColl: FinalCollectionConfiguration
): Promise<BaseGeoJsonFeature> {
  const {
    [mtColl.geometryColumnName]: geometry,
    [mtColl.pKeyColumn]: id,
    ...others
  } = row;
  const { type, coordinates } = geometry;
  return {
    type: "Feature",
    geometry: {
      type,
      coordinates,
    },
    id,
    properties: {
      [mtColl.pKeyColumn]: id,
      ...others,
    },
  };
}

async function toBaseFeatureCollection(
  xparams: ExegesisParametersObject,
  rows: { [key: string]: any }[],
  count: number,
  appContentTypes: CTInterface[]
): Promise<BaseGeoJsonFeatureCollection> {
  const { mtColl, url, offset, limit, contentNegotiation } =
    xparams.query.local;
  let links = await selfAltLinks(url, contentNegotiation, appContentTypes);
  links.concat(await featureCollectionLinks(links));

  if (offset < 1 || count - offset - limit === 0) {
    links.map((l) => l.rel !== "prev");
  }

  if (count <= 1) {
    links.map((l) => l.rel !== "next");
  }

  const features = await Promise.all(
    rows.map(async (row) => await toFeature(row, mtColl))
  );
  return {
    type: "FeatureCollection",
    timeStamp: new Date().toJSON(),
    numberMatched: features.length,
    id: xparams.path.instanceId
      ? `${xparams.path.collectionId}-${xparams.path.instanceId}`
      : xparams.path.collectionId,
    numberReturned: await numberReturned(count, offset, limit),
    features,
    links: links,
  };
}

const geoJsonParsers = {
  toBaseFeatureCollection,
  toFeature,
};

export default geoJsonParsers;

async function numberReturned(
  count: number,
  offset: number,
  limit: number
): Promise<number> {
  let numberReturned: number = 0;
  //numberReturned += limit//Math.min(limit, count - offset);
  const startIndex = Math.min(offset, count);
  const endIndex = Math.min(startIndex + limit, count);
  //
  numberReturned += endIndex - startIndex;
  return numberReturned;
}
