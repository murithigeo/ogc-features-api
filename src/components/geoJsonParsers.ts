import {
  BaseGeoJsonFeature,
  BaseGeoJsonFeatureCollection,
  CTInterface,
  ExegesisParametersObject,
} from "../types.js";
import { FinalCollectionConfiguration } from "../collections.js";
import selfAltLinks from "./links/selfAltLinks.js";
import featureCollectionLinks from "./links/geojsonFeatureCollectionLinks.js";
import numberMatched from "./utils/numberMatched.js";

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
  links.push(...(await featureCollectionLinks(links)));

  return {
    type: "FeatureCollection",
    timeStamp: new Date().toJSON(),
    numberReturned: rows.length,
    id: xparams.path.instanceId
      ? `${xparams.path.collectionId}-${xparams.path.instanceId}`
      : xparams.path.collectionId,
    numberMatched: await numberMatched(offset, limit, count),
    features: await Promise.all(
      rows.map(async (row) => await toFeature(row, mtColl))
    ),
    links,
  };
}



const geoJsonParsers = {
  toBaseFeatureCollection,
  toFeature,
};

export default geoJsonParsers;
