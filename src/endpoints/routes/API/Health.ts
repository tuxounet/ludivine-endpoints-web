import { HttpRouter } from "../../components/HttpRouter";
import { HttpRequest } from "../../types/HttpRequest";
import { HttpResponse } from "../../types/HttpResponse";
import { HttpRestRoute } from "../../types/HttpRestRoute";

export class APIHealth extends HttpRestRoute {
  constructor(parent: HttpRouter) {
    super("api/health", parent);
  }

  method = "GET";
  path = /^\/api\/health$/gi;
  async handler(request: HttpRequest): Promise<HttpResponse> {
    return HttpResponse.okJson({ status: "OK" });
  }
}
