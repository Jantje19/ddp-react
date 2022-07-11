import { simpleDDPOptions } from "simpleddp";
import MainThreadWorkerWrapper from "./wrappers/mainThreadWorker";
export * from "./wrappers";
export * from "./context";
declare const _default: (options: Omit<simpleDDPOptions, "SocketConstructor">, worker?: Worker) => MainThreadWorkerWrapper;
export default _default;
//# sourceMappingURL=index.d.ts.map