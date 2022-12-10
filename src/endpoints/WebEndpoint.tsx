import { bases, endpoints, logging } from "@ludivine/runtime";
import { HttpRouter } from "./components/HttpRouter";
export class WebEndpoint
  extends bases.KernelElement
  implements endpoints.IEndpoint
{
  constructor(readonly endpoints: endpoints.IEndpointsBroker) {
    super("web", endpoints.kernel, endpoints);
    this.router = new HttpRouter(this);
  }

  router: HttpRouter;

  @logging.logMethod()
  async renderUI(): Promise<void> {
    await this.router.registerUIRoute();
    await this.router.listen();
    await this.kernel.waitForShutdown(this.fullName);
  }

  @logging.logMethod()
  async listenAPI(): Promise<void> {
    await this.router.registerApiRoute();
  }
}
