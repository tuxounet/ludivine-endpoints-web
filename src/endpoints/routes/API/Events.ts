import { messaging } from "@ludivine/runtime";
import http from "http";
import { HttpRouter } from "../../components/HttpRouter";

import { HttpSSERoute } from "../../types/HttpSSERoute";

export interface APIEventsEvent extends Record<string, string> {}

export interface APIEventsClient {
  id: number;
  response: http.ServerResponse<http.IncomingMessage>;
}

export class APIEvents extends HttpSSERoute {
  constructor(parent: HttpRouter) {
    super("api/events", parent);
  }

  method = "GET";
  path = /^\/api\/events$/gi;
  clients: APIEventsClient[] = [];
  facts: messaging.IMessageEvent[] = [];

  handler(
    request: http.IncomingMessage,
    response: http.ServerResponse<http.IncomingMessage>
  ): void {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    response.writeHead(200, headers);

    const data = `data: ${JSON.stringify(this.facts)}\n\n`;

    response.write(data);

    const clientId = Date.now();

    const newClient: APIEventsClient = {
      id: clientId,
      response,
    };

    this.clients.push(newClient);

    request.on("close", () => {
      this.clients = this.clients.filter((client) => client.id !== clientId);
    });
  }

  emit(newFact: messaging.IMessageEvent): void {
    const finalFact: messaging.IMessageEvent = {
      ...newFact,
      date: Date.now().toString(),
    };
    this.facts.push(finalFact);
    this.clients.forEach((client) =>
      client.response.write(`data: [${JSON.stringify(finalFact)}]\n\n`)
    );
  }
}
