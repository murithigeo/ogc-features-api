import {
  ExegesisPluginContext,
  ExegesisPlugin,
  ExegesisRunner,
} from "exegesis";
import models from "../models/index.js";
export default async function ApiKeyAuth(
  pluginContext: ExegesisPluginContext,
  info: any
) {
  //Instantiate a new url, parse it and get 'apiKey'
  let apiKey = new URL(
    pluginContext.api.serverObject.url + pluginContext.req.url
  ).searchParams.get("apiKey");

  //Set a default apiKey for missing apiKeys
  if (!apiKey) {
    apiKey = process.env.DEFAULT_API_KEY;
  }

  const dbRes: any = await models.users.findByPk(apiKey,{
    //where: { apiKey: apiKey },
    attributes: {
      include: ["key", "role", "email"],
    },
    raw: true,
    //@ts-expect-error
    includeIgnoreAttributes: false,
  });

  if (!dbRes) {
    return {
      type: "invalid",
      statusCode: 401,
      message: "Invalid apiKey",
    };
  }

  return {
    type: "success",
    user: {
      ...dbRes,
    },
  };
}
