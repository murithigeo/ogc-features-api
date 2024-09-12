import { CTInterface } from "../../types.js";

export default async function filterContentTypes(
  currentCTNegVal: CTInterface,
  allowedCNvals: CTInterface[]
) {
  return {
    //return an array with one object. Follows that a resource can have only one content-type val
    optionsForSelf: allowedCNvals.find((obj) => obj.f === currentCTNegVal.f),
    //
    optionsForAlt: allowedCNvals.filter((obj) => obj.f !== currentCTNegVal.f),
  };
}
