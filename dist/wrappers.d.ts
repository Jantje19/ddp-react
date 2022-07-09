import simpleDDP from "simpleddp";
import MainThreadWorkerWrapper from "./wrappers/mainThreadWorker";
import MainThreadWrapper from "./wrappers/mainThread";
import WorkerWrapper from "./wrappers/worker";
export * from "./wrappers/mainThreadWorker";
export * from "./wrappers/mainThread";
export * from "./wrappers/worker";
export declare const mainThreadWrapper: (client: Worker | simpleDDP) => MainThreadWorkerWrapper | MainThreadWrapper;
export declare const workerWrapper: (client: simpleDDP) => WorkerWrapper;
//# sourceMappingURL=wrappers.d.ts.map