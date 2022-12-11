import { messaging } from "@ludivine/runtime";
import { HttpRouter } from "../../components/HttpRouter";
import { HttpRequest } from "../../types/HttpRequest";
import { HttpResponse } from "../../types/HttpResponse";
import { HttpRestRoute } from "../../types/HttpRestRoute";

export class APIInput extends HttpRestRoute {
  constructor(readonly router: HttpRouter) {
    super("api/input", router);
  }

  method = "POST";
  path = /^\/api\/input$/gi;
  async handler(request: HttpRequest): Promise<HttpResponse> {
    const body = await request.readJsonBody<{ query: string }>();

    const messages =
      this.kernel.container.get<messaging.IMessagingBroker>("messaging");
    await messages.publish("/conversation/0", {
      input: body.query,
      date: Date.now().toString(),
    });

    return HttpResponse.okJson({ status: "OK" });
  }
}
