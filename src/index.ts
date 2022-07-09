import { simpleDDPOptions } from "simpleddp";

import MainThreadWorkerWrapper from "./wrappers/mainThreadWorker";
import { mainThreadWrapper } from "./wrappers";

export * from "./wrappers";
export * from "./context";

export default (options: Omit<simpleDDPOptions, "SocketConstructor">) => {
	const worker = new Worker(new URL("./worker", import.meta.url), {
		type: "module",
	});

	worker.postMessage({ __internal: true, type: "expose", data: options });

	return mainThreadWrapper(worker) as MainThreadWorkerWrapper;
};
