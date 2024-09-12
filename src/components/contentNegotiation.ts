import { CTInterface } from "../types.js";

const contentNegotiationValues: CTInterface[] = [
  {
    f: "YAML",
    contentType: "text/yaml",
  },
  {
    f: "JSON",
    contentType: "application/json",
  },
  { f: "GEOJSON", contentType: "application/geo+json" },
  {
    f: "COVERAGEJSON",
    contentType: "application/vnd.cov+json",
  },
  /*{
    f: "COVERAGEJSON",
    contentType: "application/vnd+cov+json",
  },
  */
];
export default contentNegotiationValues;
