import { HttpRouter } from "../../components/HttpRouter";
import { HttpRequest } from "../../types/HttpRequest";
import { HttpResponse } from "../../types/HttpResponse";
import { HttpRestRoute } from "../../types/HttpRestRoute";
import { APIEvents } from "./Events";

export class APIInput extends HttpRestRoute {
  constructor(readonly router: HttpRouter) {
    super("api/input", router);
  }
  method = "POST";
  path = /^\/api\/input$/gi;
  async handler(request: HttpRequest): Promise<HttpResponse> {
    const body = await request.readJsonBody<{ query: string }>();

    const eventRoute = this.router.routes.find(
      (item) => item instanceof APIEvents
    );
    if (eventRoute) {
      const events = eventRoute as APIEvents;
      events.emit({ input: body.query });
    }
    return HttpResponse.okJson({ status: "OK" });
  }
}
