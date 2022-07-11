import simpleDDP from "simpleddp";
import { expose } from "comlink";

import WorkerWrapper from "./wrappers/worker";

type MessageType = "expose";

self.addEventListener(
	"message",
	(evt) => {
		if (!evt.data || !("__internal" in evt.data) || !evt.data.__internal) {
			throw new Error("Worker first message error");
		}

		const { type, data } = evt.data as { type: MessageType; data?: any };

		switch (type) {
			case "expose":
				expose(
					new WorkerWrapper(new simpleDDP({ ...data, SocketConstructor: WebSocket }))
				);
				break;
			default:
				throw new Error(`Invalid message type: '${type}'`);
		}
	},
	{ once: true }
);
