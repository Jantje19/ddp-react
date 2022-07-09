import { ddpSubscription } from "simpleddp/classes/ddpSubscription";
import { ddpCollection } from "simpleddp/classes/ddpCollection";
import simpleDDP from "simpleddp";
import { proxy } from "comlink";

import { GenericCollection, Subscription, Wrapper } from "../types";

export class WorkerSubscription implements Subscription {
	#subscription: ddpSubscription;

	constructor(subscription: ddpSubscription) {
		this.#subscription = subscription;
	}

	ready(): Promise<void> {
		return this.#subscription.ready();
	}

	remove(): Promise<void> {
		return Promise.resolve(this.#subscription.remove());
	}
}

class WorkerWrapper implements Wrapper {
	#client: simpleDDP;

	constructor(client: simpleDDP) {
		this.#client = client;
	}

	connect(): Promise<void> {
		return this.#client.connect();
	}

	internalCollection<T>(
		...args: Parameters<Wrapper["internalCollection"]>
	): Promise<GenericCollection<T>> {
		return Promise.resolve(
			proxy(new GenericCollection<T>(this.collection<T>(...args), true))
		);
	}

	collection<T>(...args: Parameters<simpleDDP["collection"]>) {
		return Wrapper.collection<unknown>(
			this.#client.collection.bind(this.#client),
			...args
		) as ddpCollection<T>;
	}

	async call<T>(method: string, ...args: any[]): Promise<T> {
		const result = await this.#client.call(method, ...args);
		return result as T;
	}

	subscribe(pubname: string, ...args: any[]): Promise<WorkerSubscription> {
		return Promise.resolve(
			proxy(new WorkerSubscription(this.#client.subscribe(pubname, ...args)))
		);
	}
}

export default WorkerWrapper;
