import { simpleDDPOptions } from "simpleddp";

import MainThreadWorkerWrapper from "./wrappers/mainThreadWorker";
import { mainThreadWrapper } from "./wrappers";

export * from "./wrappers";
export * from "./context";

export default (
	options: Omit<simpleDDPOptions, "SocketConstructor">,
	worker?: Worker
) => {
	const finalWorker =
		worker ??
		new Worker(new URL("./worker", import.meta.url), {
			type: "module",
		});

	finalWorker.postMessage({ __internal: true, type: "expose", data: options });

	return mainThreadWrapper(finalWorker) as MainThreadWorkerWrapper;
};
