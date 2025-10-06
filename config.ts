import {
  type Bbox,
  bbox,
  type crs,
  CRS84,
  type Datetime,
  type Elevation,
  elevationFilter,
  type Feature,
  type FeatureCollection,
  geometryIntersects,
  type Interval,
  type Link,
  numberReturned,
  reproject,
} from "./utils/index.ts";
import mountains from "./mountains.json" with { type: "json" };

const features: Feature[] = mountains.features
  .map((p) => ({
    ...p,
    id: p.properties.name,
    properties: { ...p.properties, countries: p.properties.countries || [] },
  }))
  .sort((a, b) => a.properties.name.localeCompare(b.properties.name));

export type Dataset = {
  crs: Array<keyof typeof crs>;
  id: string;
  storageCrs: string;
  title?: string;
  attribution?: Array<Link>;
  description?: string;
  extent: () => { bbox: Bbox[]; interval: Interval[]; crs: string };
  handler: ({
    ...props
  }: {
    bbox?: GeoJSON.Polygon;
    datetime?: Datetime;
    z?: Elevation;
    limit: number;
    offset: number;
    crs: keyof typeof crs;
    featureId?: string | number;
  }) => Promise<FeatureCollection> | FeatureCollection;
};
type Config = {
  datasets: Array<Dataset>;
};

export default {
  datasets: [
    {
      id: "world-mountains",
      description: "Mountains of the world and their metadata",
      crs: [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/4326",
        "OGC:CRS84",
        "EPSG:4326",
      ],
      storageCrs: CRS84,
      extent: () => {
        return {
          bbox: [bbox({ type: "FeatureCollection", features })],
          interval: [[null, null]],
          crs: CRS84,
        };
      },
      handler: ({ ...props }) => {
        const matched = features
          .filter((feat) => {
            if (!props.featureId) return true;
            return feat.properties.name === props.featureId.toString();
          })
          .filter(geometryIntersects(props.bbox))
          .filter(elevationFilter(props.z, "meters"));

        return {
          type: "FeatureCollection",
          timeStamp: new Date().toJSON(),
          numberMatched: matched.length,
          numberReturned: numberReturned(
            matched.length,
            props.limit,
            props.offset,
          ),
          features: matched
            .slice(props.offset, props.offset + props.limit)
            .map(reproject("OGC:CRS84", props.crs)),
        };
      },
      attribution: [
        {
          rel: "author",
          href: "jason@waldrip.net",
          title: "Email Jason Waldrip",
        },
        {
          rel: "original",
          href: "https://github.com/open-peaks/data",
          type: "text/html",
          title: "View Original",
        },
      ],
    },
  ],
} as Config;
