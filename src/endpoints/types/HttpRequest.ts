import { IncomingMessage } from "http";

export class HttpRequest {
  url: string;
  method: string;
  body?: string;

  constructor(readonly incoming: IncomingMessage) {
    this.url = incoming.url !== undefined ? incoming.url.trim() : "/";
    this.method =
      incoming.method !== undefined
        ? incoming.method.trim().toUpperCase()
        : "NONE";
  }

  async readTextBody(): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
      let body = "";
      this.incoming.on("data", (chunk: string) => {
        body += chunk.toString(); // convert Buffer to string
      });
      this.incoming.on("end", () => {
        resolve(body);
      });
      this.incoming.on("error", (e) => {
        reject(e);
      });
    });
  }

  async readJsonBody<T = unknown>(): Promise<T> {
    return await new Promise<T>((resolve, reject) => {
      let body = "";
      this.incoming.on("data", (chunk: string) => {
        body += chunk.toString(); // convert Buffer to string
      });
      this.incoming.on("end", () => {
        resolve(JSON.parse(body) as T);
      });
      this.incoming.on("error", (e) => {
        reject(e);
      });
    });
  }
}
