import { ParametersByLocation, ParametersMap } from "exegesis-express";
import { FinalCollectionConfiguration } from "./collections.ts";

interface CollectionConfiguration {
  modelName: string;
  dateTimeColName: string;
  collectionId: string;
  geometryColumnName: string;
  pKeyColumn: string;
  storageCrsCode: string | number;
  supportedCrs: (string | number)[];
}
export interface BaseGeoJsonFeature {
  type: "Feature";
  id: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties?: {
    [key: string]: any;
  };
  links?: Link[];
}
export interface BaseGeoJsonFeatureCollection {
  type: "FeatureCollection";
  id: string;
  bbox?: FourItemBbox | SixItemBbox;
  timeStamp: string;
  numberMatched: number;
  numberReturned: number;
  features: BaseGeoJsonFeature[];
  links?: Link[];
}
export type TemporalInterval = [string | null, string | null][];

interface BaseExtentSpatial {
  bbox: FourItemBbox[] | SixItemBbox[];
  crs: CRS_URI;
}
interface BaseExtentTemporal {
  interval: TemporalInterval;
  trs: string;
}
export interface BaseExtent {
  spatial: BaseExtentSpatial;
  temporal: BaseExtentTemporal;
}

interface BaseCollection {
  description?: string;
  id: string;
  title?: string;
  extent: BaseExtent;
  storageCrsCoordinateEpoch?: number;
  links: Link[];
  crs: string[];
  storageCrs?: string;
  itemType: "feature";
}
type NODE_ENV = "development" | "production" | "test";

/**
 * @description Generic CRS uri
 */
export type CRS_URI = `http://www.opengis.net/def/crs/${string}/${number}/${
  | string
  | number}`;

/**
 * @description The structure of a Coordinate Reference System object
 * @property {type} Geographic or Projected
 * @property {crs}
 */
export interface CrsProperty {
  type: "GeographicCRS" | "ProjectedCRS";
  crs: CRS_URI;
  /**
   * @description The wellknown text v2 of @type {CRS_URI}
   */
  wkt: string;
  /**
   * @description The version of the wkt definition
   * @default 0 except for the following wkt codes such as @example [CRS84,CRS83,CRS27]
   */
  version: number;
  /**
   * @description The code of the @type {CRS_URI}.
   */
  code: string | number;
  /**
   * @description While new OGC wkt such as [CRS84,CRS84h, CRS27, CRS83] are based on existing @SpatialReferenceIdentifiers
   * @description and are one and the same as [4326,4327,4269,4267], their wkt definitions are different.
   * @description By reusing these definitions, then I don't have to create new definitions in the spatial_ref_sys table
   */
  srid: number;
  /**
   * @description The authority governing the wkt definition
   * @default EPSG
   * @examples EPSG, OGC, ESRI
   */
  authority: string;
  /**
   * @description Tells the ORM on what to tell PostGIS to do.
   * @example PostGis allows 3D geometries in EPSG:4326 which is only 2D
   */
  hasZ: boolean;
  /**
   * @description Tells the ORM on what do tell PostGIS to do to the axis order
   * This is because PostGIS uses a longitude,latitude axis order even for GeographicCRS
   * @exceptions All Geographic CRS will have a @true value except for the OGC-governed CRSs
   */
  flipCoords: boolean;
}

interface ParsedDateTime {
  min?: string | undefined;
  max?: string | undefined;
  in?: string[] | undefined;
}

/**
 * @description The content type negotiator keyword. For some endpoints, the end content type is the same
 * @example when requesting geojson from the items endpoint, GEOJSON and JSON should result in the same content type
 */
export type CTNegotiator = "JSON" | "YAML" | "COVERAGEJSON" | "GEOJSON";

/**
 * @description The resulting content type for the content. Some of these values often share the same @CTNegotiator
 */
export type CTValue =
  | "application/json"
  | "text/yaml"
  | "application/vnd.cov+json"
  | "application/geo+json";

/**
 * @description The mapping of content-types and their negotiator
 */
export interface CTInterface {
  f: CTNegotiator;
  contentType: CTValue;
}

export type FourItemBbox = [number, number, number, number];
export type SixItemBbox = [...FourItemBbox, number, number];
export interface Link {
  title?: string;
  href: string;
  type?: string;
  hreflang?: string;
  rel:
    | "items"
    | "data"
    | "collection"
    | "self"
    | "prev"
    | "next"
    | "alternate"
    | "service-desc"
    | "service-doc"
    | "enclosure"
    | "conformance"
    | "license";
  length?: number;
  templated?: boolean;
}
interface ParsedZ {
  min?: number | undefined;
  max?: number | undefined;
  in?: number[] | undefined;
  //one: number | undefined;
}

export type ExegesisParametersObject = ParametersByLocation<ParametersMap<any>>;

export interface LocalParams {
  mtColl: FinalCollectionConfiguration;
  crsProperty: CrsProperty;
  bboxCrsProperty: CrsProperty;
  z: ParsedZ;
  datetime: ParsedDateTime;
  url: URL;
  contentNegotiation: CTInterface;
  bbox: ParsedBbox;
  contentCrs: `<${CRS_URI}>`;
}

export interface ParsedBbox {
  xy: FourItemBbox;
  z?: [number, number];
}
