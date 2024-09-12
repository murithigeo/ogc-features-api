const httpMessages: { [key: number]: { message: string } } = {
  200: { message: "Successful request" },
  201: { message: "Successful resource creation" },
  202: { message: "Successful request but processing currently incomplete" },
  203: { message: "Successful request, returning daata from another source" },
  204: { message: "Successful request. No additional content returned" },
  205: {
    message:
      "Successful request. No additional content returned. User may need to refresh the page",
  },
  206: {
    message:
      "Successful request. Partial content returned according to user parameters",
  },
  300: { message: "Multiple redirect links available" },
  301: { message: "Requested resource has moved to a new URL permanently" },
  302: { message: "Requested resource has moved to a new URL temporarily" },
  303: { message: "Requested resource exists on other URLs" },
  304: {
    message: "Requested resource has not been modified since last request",
  },
  400: {
    message:
      "User provided incorrect [query, path, cookie, server, requestBody] params currently unsupported by the server",
  },
  401: {
    message:
      "Valid request but the user does not have the necessary permissions to execute the request",
  },
  402: { message: "Payment required" },
  403: { message: "Valid request. Server is refusing to respond" },
  404: { message: "Valid request but resource not found" },
  405: { message: "" },
  500: { message: "Internal Server Error Occurred" },
};

export default httpMessages;
