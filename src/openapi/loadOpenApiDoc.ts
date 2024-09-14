import { oas3 } from "exegesis-express";
import os from "os";
const MODE = import.meta.env.MODE;
const PORT =
  MODE === "production" ? parseInt(import.meta.env.VITE_PORT) ?? 10000 : 3000;
const BASE_URL = import.meta.env.VITE_BASE_URL;
import YAML from "js-yaml";
import fs from "fs";
console.log(import.meta.env);
console.log(process.env);
export default function loadOpenApiDoc(){

  let serversArray: oas3.ServerObject[] = [];

  if (MODE === "production") {
    if (!BASE_URL) {
      throw new Error(
        "Production hostname via BASE_URL env key must be defined"
      );
    }
    //Do not use port because render routes all traffic to specific port
    serversArray.push({
      url: `https://${BASE_URL}`,
      description: "Production Server",
    });
  }
  if (MODE !== "production") {
    var ifaces: any = os.networkInterfaces();
    var ips: any = 0;
    Object.keys(ifaces).forEach((dev) => {
      if (!dev.toLowerCase().includes("wsl")) {
        // Filter out WSL interfaces
        ifaces[dev].forEach((details: any) => {
          if (details.family === "IPv4" && !details.internal) {
            ips = details.address;
          }
        });
      }
    });
    ips !== 0
      ? serversArray.push({
          url: `http://${ips}:${PORT}`,
          description: "Test Server",
        })
      : null;
    serversArray.push({
      url: `http://localhost:${PORT}`,
      description: `Development Server`,
    });
  }

  if (serversArray.length < 1) {
    throw new Error("servers must not be empty");
  }
  for (const serverObject of serversArray) {
    if (!URL.canParse(serverObject.url))
      throw new Error(`Error generating valid server URLs` + serverObject.url);
  }
  const apiDoc = YAML.load(
    fs.readFileSync(import.meta.dirname + "/features.openapi.yaml", "utf8")
  ) as oas3.OpenAPIObject;
  apiDoc.servers = serversArray;
  return apiDoc;
}
