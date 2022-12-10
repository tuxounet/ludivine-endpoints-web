import { IncomingMessage } from "http";

export class HttpRequest {
  constructor(readonly incoming: IncomingMessage) {
    this.url = incoming.url || "/";
    this.method = incoming.method?.trim().toUpperCase() || "NONE";
  }

  url: string;
  method: string;
}
