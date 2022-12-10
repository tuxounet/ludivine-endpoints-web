import { HttpRouter } from "../../components/HttpRouter";
import { HttpRequest } from "../../types/HttpRequest";
import { HttpResponse } from "../../types/HttpResponse";
import { HttpRestRoute } from "../../types/HttpRestRoute";

export class UIRoot extends HttpRestRoute {
  constructor(parent: HttpRouter) {
    super("ui/root", parent);
  }
  method = "GET";
  path = /^\/$/gi;
  async handler(request: HttpRequest): Promise<HttpResponse> {
    return HttpResponse.ok("Hello le monde /");
  }
}
