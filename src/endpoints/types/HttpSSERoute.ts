import { HttpRoute } from "./HttpRoute";
import http from "http";
export abstract class HttpSSERoute extends HttpRoute {
  abstract handler(
    request: http.IncomingMessage,
    response: http.ServerResponse<http.IncomingMessage>
  ): void;
}
