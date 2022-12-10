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
  facts: APIEventsEvent[] = [];

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
      console.log(`${clientId} Connection closed`);
      this.clients = this.clients.filter((client) => client.id !== clientId);
    });
  }

  emit(newFact: APIEventsEvent) {
    this.facts.push(newFact);
    this.clients.forEach((client) =>
      client.response.write(`data: ${JSON.stringify(newFact)}\n\n`)
    );
  }
}
