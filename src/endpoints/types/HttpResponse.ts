export class HttpResponse {
  static ok(body?: string): HttpResponse {
    return new HttpResponse(200, "OK", body);
  }

  static okJson(object?: any): HttpResponse {
    return new HttpResponse(
      200,
      "OK",
      object !== undefined ? JSON.stringify(object) : undefined,
      object !== undefined ? "application/json" : undefined
    );
  }

  static notfound(message?: string): HttpResponse {
    return new HttpResponse(404, "not found", message);
  }

  static badquery(message?: string): HttpResponse {
    return new HttpResponse(400, "bad query", message);
  }

  static failure(e?: unknown): HttpResponse {
    if (e instanceof Error)
      return new HttpResponse(500, "server failure", e.message);
    else return new HttpResponse(500, "server failure", String(e));
  }

  private constructor(
    public statusCode: number,
    public statusDescription?: string,
    public body?: string,
    public contentType?: string
  ) {}
}
