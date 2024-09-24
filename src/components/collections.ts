import queryTemporalInterval from "./queries/queryTemporalInterval.js";
import querySpatialBbox from "./queries/querySpatialBbox.js";
import {
  BaseCollection,
  CollectionConfiguration,
  CTInterface,
  ExegesisParametersObject,
  FourItemBbox,
  Link,
  SixItemBbox,
} from "../types.js";
import models from "../models/index.js";
import dateTimeValidator from "./utils/dateTimeValidator.js";
import { FinalCollectionConfiguration } from "../collections.js";
import { crs84hUri, crs84Uri } from "./utils/crsdetails.js";
import trsDetails from "./utils/trsDetails.js";
import selfAltLinks from "./links/selfAltLinks.js";
import { ExegesisRoute } from "exegesis-express";

export default async function genCollectionInfo(
  xparams: ExegesisParametersObject
): Promise<BaseCollection> {
  const {
    mtColl,
    url,
    contentNegotiation,
    route,
  }: {
    route: ExegesisRoute;
    mtColl: FinalCollectionConfiguration;
    contentNegotiation: CTInterface;
    url: URL;
  } = xparams.query.local;
  const { modelName, datetimeColName }: FinalCollectionConfiguration = mtColl;
  let collectionId = xparams.path.collectionId || mtColl.collectionId;
  const { allowZ } = xparams.query;

  //Instantiate extent_bbox
  let extent_bbox: FourItemBbox[] | SixItemBbox[] = await querySpatialBbox(
    models,
    mtColl.geometryColumnName,
    modelName
  );

  const tempInterval = await queryTemporalInterval(
    models,
    modelName,
    datetimeColName
  );

  let isUTC: boolean =
    dateTimeValidator(tempInterval[0][0]) &&
    dateTimeValidator(tempInterval[0][1]);

  //Get zmin & zmax before deletion
  const zMin = extent_bbox[0][2];
  const zMax = extent_bbox[0][5];
  if ((!zMax && !zMin) || !allowZ) {
    extent_bbox = [
      [
        extent_bbox[0][0],
        extent_bbox[0][1],
        extent_bbox[0][3],
        extent_bbox[0][4],
      ],
    ];
  }
  const collectionURL = new URL(url);
  collectionURL.search = "";
  collectionURL.pathname =
    collectionURL.pathname +
    (route.path === "/collections/{collectionId}"
      ? "/items"
      : `/${collectionId}/items`);
  const links =
    route.path === "/collections/{collectionId}"
      ? (
          await selfAltLinks(url, contentNegotiation, [
            { f: "JSON", contentType: "application/json" },
          ])
        ).concat({
          href: collectionURL.toString(),
          rel: "items",
          title: "View Items",
          type: "application/geo+json",
        })
      : ([
          {
            href: collectionURL.href,
            rel: "items",
            type: "application/geo+json",
            title: `View Items`,
          },
        ] as Link[]);

  return {
    id: collectionId ?? mtColl.collectionId,
    crs: mtColl.crs,
    title: mtColl.collectionId + " collection",
    extent: {
      spatial: {
        bbox: extent_bbox,
        crs: extent_bbox[0].length > 4 ? crs84hUri : crs84Uri,
      },
      temporal: {
        interval: tempInterval,
        trs: isUTC ? trsDetails.UTC.calendar : trsDetails.Gregorian.calendar,
      },
    },
    itemType: "feature",
    links,
  };
}
