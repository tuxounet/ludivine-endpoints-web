import { endpoints, modules } from "@ludivine/runtime";
import { WebEndpoint } from "./endpoints/WebEndpoint";

const moduleDefinition: modules.IModuleDefinition = {
  endpoints: [
    {
      name: "web",
      ctor: (endpoints: endpoints.IEndpointsBroker) =>
        new WebEndpoint(endpoints),
    },
  ],
};
export default moduleDefinition;
