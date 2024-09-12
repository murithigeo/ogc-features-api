import { CTInterface, Link } from "../../types.js";
import filterContentTypes from "./filterContentTypes.js";
/**
 * @description generate link objects where link.rel= "self"||"alt"
 * @param url - the url object of the current endpoint
 * @param currentCTNegVal - the content negotiation values of the current endpoint
 * @param appContentTypes - the content negotiation values to be used in the links
 * @returns Link[] - an array of link objects
 * @applicability - {root}/collections, {root}/collections/{collectionId}, {root}/collections/{collectionId}/items
 */
export default async function selfAltLinks(
  url: URL,
  currentCTNegVal: CTInterface,
  appContentTypes: CTInterface[]
) {
  const { optionsForAlt, optionsForSelf } = await filterContentTypes(
    currentCTNegVal,
    appContentTypes
  );
  const links: Link[] = [];
  //url.searchParams.set("f", optionsForSelf.f);
  links.push({
    title: `This document as ${optionsForSelf.f}`,
    rel: "self",
    href: url.href,
    type: optionsForSelf.contentType,
  });
  for (const cnVal of optionsForAlt) {
    url.searchParams.set("f", cnVal.f);
    links.push({
      title: `This document as ${cnVal.f}`,
      rel: "alternate",
      href: url.toString(),
      type: cnVal.contentType,
    });
  }
  return links;
}
