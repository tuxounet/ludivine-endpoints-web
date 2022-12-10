import { bases, config } from "@ludivine/runtime";
import { IncomingMessage } from "http";
import { WebEndpoint } from "../WebEndpoint";
import http from "http";
import { HttpRestRoute } from "../types/HttpRestRoute";
import { UIRoot } from "../routes/UI/Root";
import { HttpRequest } from "../types/HttpRequest";
import { HttpResponse } from "../types/HttpResponse";
import { APIHealth } from "../routes/API/Health";
import { HttpSSERoute } from "../types/HttpSSERoute";
import { APIEvents } from "../routes/API/Events";
import { HttpRoute } from "../types/HttpRoute";

export class HttpRouter extends bases.KernelElement {
  constructor(endpoint: WebEndpoint) {
    super("http-router", endpoint.kernel, endpoint);
    this.routes = [];
  }

  routes: HttpRoute[];

  async registerUIRoute() {
    this.routes.push(new UIRoot(this));
  }

  async registerApiRoute() {
    this.routes.push(new APIHealth(this));
    this.routes.push(new APIEvents(this));
  }

  async listen() {
    const config = this.kernel.container.get<config.IConfigBroker>("config");

    const port = await config.get("endpoints.web.port", 32128);
    await new Promise<void>((resolve, reject) => {
      try {
        const server = http.createServer((request, response) => {
          this.handleHttpRequest(request, response);
        });
        server.listen(port, () => {
          this.log.info("listening on port", port);
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async handleHttpRequest(
    request: http.IncomingMessage,
    response: http.ServerResponse<IncomingMessage>
  ) {
    try {
      const httpRequest = new HttpRequest(request);

      const route = this.routes.find(
        (route) =>
          route.method === httpRequest.method &&
          route.path.test(httpRequest.url)
      );
      if (!route) {
        return this.answer(response, HttpResponse.notfound());
      }
      if (route instanceof HttpRestRoute) {
        const httpResponse = await route.handler(httpRequest);
        return this.answer(response, httpResponse);
      }
      if (route instanceof HttpSSERoute) {
        return route.handler(request, response);
      }

      return this.answer(response, HttpResponse.notfound());
    } catch (e) {
      this.log.error(e);
      return this.answer(response, HttpResponse.failure(e));
    }
  }

  private answer(response: http.ServerResponse, httpResponse: HttpResponse) {
    if (httpResponse.contentType) {
      response.setHeader("content-type", httpResponse.contentType);
    }

    response.writeHead(httpResponse.statusCode, httpResponse.statusDescription);
    if (httpResponse.body) {
      response.write(httpResponse.body);
    }
    response.end();
  }
}
