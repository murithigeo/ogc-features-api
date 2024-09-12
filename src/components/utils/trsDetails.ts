const trsDetails: {
  [key in"Gregorian" | "UTC"]: { calendar: string ; name: string };
} = {
  Gregorian: {
    calendar: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
    name: "Gregorian Calendar/TRS (Without Time info",
  },
  UTC: {
    calendar: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
    name: "UTC Calendar/TRS (with time info)"
  }
};
//Temporal Reference System Identifier

export default trsDetails;
