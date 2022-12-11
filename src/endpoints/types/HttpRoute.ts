import { bases } from "@ludivine/runtime";
import { HttpRouter } from "../components/HttpRouter";

export abstract class HttpRoute extends bases.KernelElement {
  constructor(name: string, parent: HttpRouter) {
    super(name, parent.kernel, parent);
  }

  method: string = "NONE";
  path: RegExp = /^\/nowhere$/;
}
