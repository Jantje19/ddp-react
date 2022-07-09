import { expose, wrap } from "comlink";
import simpleDDP from "simpleddp";
import MainThreadWorkerWrapper from "./wrappers/mainThreadWorker";
import MainThreadWrapper from "./wrappers/mainThread";
import WorkerWrapper from "./wrappers/worker";
export * from "./wrappers/mainThreadWorker";
export * from "./wrappers/mainThread";
export * from "./wrappers/worker";
export const mainThreadWrapper = (client) => {
    if (client instanceof Worker) {
        return new MainThreadWorkerWrapper(wrap(client));
    }
    if (client instanceof simpleDDP) {
        return new MainThreadWrapper(client);
    }
    throw new Error("Invalid 'client' argument passed to 'mainThreadWrapper'. Expected an instance of 'Worker' or 'simpleDDP'.");
};
export const workerWrapper = (client) => {
    const wrapper = new WorkerWrapper(client);
    expose(wrapper);
    return wrapper;
};
