import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";
import { HttpRoute } from "./HttpRoute";

export abstract class HttpRestRoute extends HttpRoute {
  abstract handler(request: HttpRequest): Promise<HttpResponse>;
}
