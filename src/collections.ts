import crsproperties from "./components/utils/crsdetails.js";
import { CollectionConfiguration } from "./types.js";

const collections: CollectionConfiguration[] = [
  {
    pKeyColumn: "name",
    storageCrsCode: "CRS84h",
    geometryColumnName: "geom",
    collectionId: "points",
    supportedCrs: ["CRS84", 4326, "CRS84h", 4327],
    modelName: "mountains",
    dateTimeColName: null,
  },
];
export interface FinalCollectionConfiguration {
  collectionId: string;
  geometryColumnName: string;
  datetimeColName: string;
  pKeyColumn: string;
  storageCrsCode: string | number;
  storageSRID: number;
  crs: string[];
  modelName: string;
}
const finalCollections: FinalCollectionConfiguration[] = collections.map(
  (collection) => {
    return {
      modelName: collection.modelName,
      collectionId: collection.collectionId,
      geometryColumnName: collection.geometryColumnName,
      pKeyColumn: collection.pKeyColumn,
      datetimeColName: collection.dateTimeColName,
      storageCrsCode: collection.storageCrsCode,
      storageSRID: crsproperties.find(
        (c) => c.code === collection.storageCrsCode
      ).srid,
      crs: collection.supportedCrs.map(
        (crs) => crsproperties.find((c) => c.code === crs)?.crs
      ),
    };
  }
);
export default finalCollections;
