import { CrsProperty } from "../../types.js";
import crsproperties from "./crsdetails.js";

/**
 *
 * @param uri The http(s) string used to identify a coordinate reference system on OGC APIs
 * @returns {CrsProperty}
 */
export default function validateCrsUri(uri: string): CrsProperty {
  const x = crsproperties.find((crsDet) => crsDet.crs === uri);
  return x;
}


//console.log(validateCrsUri(`https://www.opengis.net/def/crs/OGC/1.3/CRS84`))