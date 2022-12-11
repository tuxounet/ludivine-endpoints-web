import { bases, config, logging, messaging } from "@ludivine/runtime";
import http, { IncomingMessage } from "http";
import { WebEndpoint } from "../WebEndpoint";
import { HttpRestRoute } from "../types/HttpRestRoute";
import { UIRootPage } from "../routes/UI/RootPage";
import { HttpRequest } from "../types/HttpRequest";
import { HttpResponse } from "../types/HttpResponse";
import { APIHealth } from "../routes/API/Health";
import { HttpSSERoute } from "../types/HttpSSERoute";
import { APIEvents } from "../routes/API/Events";
import { HttpRoute } from "../types/HttpRoute";
import { APIInput } from "../routes/API/Input";

export class HttpRouter extends bases.KernelElement {
  constructor(endpoint: WebEndpoint) {
    super("http-router", endpoint.kernel, endpoint);
    this.routes = [];
  }

  routes: HttpRoute[];

  @logging.logMethod()
  async initialize(): Promise<void> {
    const messages =
      this.kernel.container.get<messaging.IMessagingBroker>("messaging");
    await messages.subscribeTopic("/conversation/0", this);
  }

  @logging.logMethod()
  async shutdown(): Promise<void> {
    const messages =
      this.kernel.container.get<messaging.IMessagingBroker>("messaging");
    await messages.unsubscribeTopic("/conversation/0", this.fullName);
  }

  @logging.logMethod()
  async registerUIRoute(): Promise<void> {
    this.routes.push(new UIRootPage(this));
  }

  @logging.logMethod()
  async registerApiRoute(): Promise<void> {
    this.routes.push(new APIHealth(this));
    this.routes.push(new APIEvents(this));
    this.routes.push(new APIInput(this));
  }

  @logging.logMethod()
  async listen(): Promise<void> {
    const config = this.kernel.container.get<config.IConfigBroker>("config");

    const port = await config.get("endpoints.web.port", 32128);
    await new Promise<void>((resolve, reject) => {
      try {
        const server = http.createServer((request, response) => {
          this.handleHttpRequest(request, response).catch((e) =>
            this.log.error(e)
          );
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

  @logging.logMethod()
  async handleHttpRequest(
    request: http.IncomingMessage,
    response: http.ServerResponse<IncomingMessage>
  ): Promise<void> {
    try {
      const httpRequest = new HttpRequest(request);

      const routes = this.routes
        .filter((route) => route.method === httpRequest.method)
        .filter((route) => httpRequest.url.match(route.path));

      if (routes.length === 0) {
        return this.answer(response, HttpResponse.notfound());
      }
      const route = routes[0];

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

  @logging.logMethod()
  async onMessage(message: messaging.IMessageEvent): Promise<void> {
    const route = this.routes.find((item) => item instanceof APIEvents);
    if (route) {
      (route as APIEvents).emit(message);
    }
  }
  private answer(
    response: http.ServerResponse,
    httpResponse: HttpResponse
  ): void {
    if (httpResponse.contentType !== undefined) {
      response.setHeader("content-type", httpResponse.contentType);
    }

    response.writeHead(httpResponse.statusCode, httpResponse.statusDescription);
    if (httpResponse.body !== undefined) {
      response.write(httpResponse.body);
    }
    response.end();
  }
}
