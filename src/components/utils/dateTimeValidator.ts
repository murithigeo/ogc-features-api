import { Ajv } from "ajv";
import addFormats from "ajv-formats";
const ajv = new Ajv();
//@ts-ignore
addFormats(ajv);
const dateTimeValidator = ajv.compile({
  type: "string",
  format: "date-time",
});

export default dateTimeValidator