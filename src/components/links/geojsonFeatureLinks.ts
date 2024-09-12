import { Link } from "../../types.js";

export default async function geojsonFeatureLinks(
  selfLink: Link
): Promise<Link[]> {
  let selfLinkUrl = new URL(selfLink.href);
  const itemsUrl = new URL(selfLinkUrl);
  const collectionUrl = new URL(selfLinkUrl);
  itemsUrl.search = "";
  let links: Link[] = [];
  
  links.push({
    title: "items metadata",
    rel: "items",
    href: new URL(".", itemsUrl.href).href.slice(0, -1),
    type: "application/geo+json",
  });

  //Move two level above to collection metadata
  
  links.push({
    title: "collection metadata",
    rel: "data",
    href: new URL("..", collectionUrl).href.slice(0, -1),
    type: "application/json",
  });
  return links;
}
