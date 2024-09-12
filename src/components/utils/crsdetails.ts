//The mandated defaults
export const crs84Uri: CRS_URI = "http://www.opengis.net/def/crs/OGC/1.3/CRS84";
export const crs84hUri: CRS_URI = "http://www.opengis.net/def/crs/OGC/0/CRS84h";
import { readFileSync } from "fs";
import { CRS_URI, CrsProperty } from "../../types.js";
import rawCRS from "./crsproperties.json";
//const rawCRS = createRequire(import.meta.url)("./crsproperties.json")
//console.log(crsproperties);
//import wktParser from "wkt-crs";
const crsproperties = Object.values(rawCRS) as CrsProperty[];
export default crsproperties;
