import finalCollections from "../../collections.js";
import { ExegesisParametersObject } from "../../types.js";

export default function collectionIdMatching(params: ExegesisParametersObject) {
  const { collectionId } = params.path;
  const collection = finalCollections.find(
    (c) => c.collectionId === collectionId
  );
  if (collectionId) {
    if (!collection) {
      throw new Error("404", {
        cause: `Collection ${collectionId} not found`,
      });
    }
    params.query.local.mtColl = collection;
  }
  return params;
}
