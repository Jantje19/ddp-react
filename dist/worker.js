import simpleDDP from "simpleddp";
import { expose } from "comlink";
import WorkerWrapper from "./wrappers/worker";
self.addEventListener("message", (evt) => {
    if (!evt.data || !("__internal" in evt.data) || !evt.data.__internal) {
        throw new Error("Worker first message error");
    }
    const { type, data } = evt.data;
    switch (type) {
        case "expose":
            expose(new WorkerWrapper(new simpleDDP({ ...data, SocketConstructor: WebSocket })));
            break;
        default:
            throw new Error(`Invalid message type: '${type}'`);
    }
}, { once: true });
