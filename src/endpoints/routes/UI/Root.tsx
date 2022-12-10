import { HttpRouter } from "../../components/HttpRouter";
import { HttpRequest } from "../../types/HttpRequest";
import { HttpResponse } from "../../types/HttpResponse";
import { HttpRestRoute } from "../../types/HttpRestRoute";
import { EventsComponent } from "./EventsComponent";
export class UIRoot extends HttpRestRoute {
  constructor(parent: HttpRouter) {
    super("ui/root", parent);
  }
  method = "GET";
  path = /^\/$/gi;

  async handler(request: HttpRequest): Promise<HttpResponse> {
    return {
      statusCode: 200,
      contentType: "text/html",
      body: `<html>
<head><title>Ludivine</title> 
</head><body>
 ${EventsComponent()}
</body></html>`,
    };
  }
}
