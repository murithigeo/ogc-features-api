import { Link } from "../../types.js";

export default async function featureCollectionLinks(
  selfAltLinks: Link[]
): Promise<Link[]> {
  const selfLink = selfAltLinks.find((link) => link.rel === "self");
  const links: Link[] = [];

  const selfLinkHref = new URL(selfLink.href);

  const limit = parseInt(selfLinkHref.searchParams.get("limit")) ?? 100;
  let offset = parseInt(selfLinkHref.searchParams.get("offset")) ?? 0;
  let f = selfLinkHref.searchParams.get("f") ?? "json";
  f = f !== "JSON" ? "YAML" : "JSON";
  selfLinkHref.searchParams.set("offset", `${limit + offset}`);
  links.push({
    title: "Next page",
    rel: "next",
    href: selfLinkHref.toString(),
    type: selfLink.type,
  });

  // Add previous page link
  let xoffset = offset;
  let previousPageOffset = xoffset - limit < 0 ? 0 : xoffset - limit;

  selfLinkHref.searchParams.set("offset", `${previousPageOffset}`);

  links.push({
    title: "Previous page",
    rel: "prev",
    href: selfLinkHref.toString(),
    type: selfLink.type,
  });

  // Browse link up one level
  selfLinkHref.search = "";
  selfLinkHref.href = new URL(".", selfLinkHref.href).toString().slice(0, -1);

  links.push({
    title: "collection metadata",
    rel: "collection",
    href: selfLinkHref.toString(),
    type: "application/json",
  });
  return links;
}
