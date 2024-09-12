import { CTInterface, Link } from "../../types.js";
import selfAltLinks from "./selfAltLinks.js";

export default async function rootLinks(
  url: URL,
  currentCTNegVal: CTInterface,
  appContentTypes: CTInterface[]
): Promise<Link[]> {
  //const { options } = await filterAllowedContentTypes();
  const links = await selfAltLinks(url, currentCTNegVal, appContentTypes);
  url.search = "";

  //conformance
  links.push({
    title: `View conformance resource as ${currentCTNegVal.f}`,
    href: url.toString() + "conformance",
    type: currentCTNegVal.contentType,
    rel: "conformance",
  });

  //api
  links.push({
    title: `View the Api Definition Document as ${currentCTNegVal.f}`,
    href: url.toString() + "api",
    type: "application/vnd.oai.openapi+json;version=3.0",
    rel: "service-desc",
  });

  //api.html
  links.push({
    title: `View the interactive web console for the server`,
    href: url.toString() + "api.html",
    type: `text/html`,
    rel: "service-doc",
  });

  //collections
  links.push({
    title: `View the collections as ${currentCTNegVal.f}`,
    rel: "data",
    href: url.toString() + "collections",
    type: "application/json",
  });
  return links;
}
