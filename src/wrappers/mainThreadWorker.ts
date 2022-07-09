import { ddpCollection } from "simpleddp/classes/ddpCollection";
import { proxy, Remote } from "comlink";
import simpleDDP from "simpleddp";

import {
	Collection,
	CollectionChangeListener,
	Subscription,
	Wrapper,
} from "../types";

export class MainThreadWorkerCollection<T> implements Collection<T> {
	#collection: Collection<T>;

	constructor(collection: Collection<T>) {
		this.#collection = collection;
	}

	async fetch(...args: Parameters<Collection<T>["fetch"]>) {
		return this.#collection.fetch(...args);
	}

	async setOnChange(
		cb: CollectionChangeListener<T>,
		args: Parameters<ddpCollection<T>["reactive"]>
	) {
		return this.#collection.setOnChange(proxy(cb), args);
	}
}

class MainThreadWorkerWrapper implements Wrapper {
	#worker: Remote<Wrapper>;

	constructor(worker: Remote<Wrapper>) {
		this.#worker = worker;
	}

	connect(): Promise<void> {
		return this.#worker.connect();
	}

	async internalCollection<T>(
		...args: Parameters<simpleDDP["collection"]>
	): Promise<Collection<T>> {
		const collection = await this.collection<T>(...args);
		return new MainThreadWorkerCollection(collection);
	}

	async collection<T>(...args: Parameters<Wrapper["collection"]>) {
		const collection = await this.#worker.internalCollection(...args);
		return collection as Collection<T>;
	}

	async call<T>(method: string, ...args: any[]): Promise<T> {
		const result = await this.#worker.call(method, ...args);
		return result as T;
	}

	subscribe(...args: Parameters<Wrapper["subscribe"]>): Promise<Subscription> {
		return this.#worker.subscribe(...args);
	}
}

export default MainThreadWorkerWrapper;
