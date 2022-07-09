import { ddpSubscription } from "simpleddp/classes/ddpSubscription";
import { ddpCollection } from "simpleddp/classes/ddpCollection";
import simpleDDP from "simpleddp";

import { Collection, GenericCollection, Subscription, Wrapper } from "../types";

export class MainThreadSubscription implements Subscription {
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

class MainThreadWrapper implements Wrapper {
	#client: simpleDDP;

	constructor(client: simpleDDP) {
		this.#client = client;
	}

	connect(): Promise<void> {
		return this.#client.connect();
	}

	internalCollection<T>(
		...args: Parameters<simpleDDP["collection"]>
	): Promise<Collection<T>> {
		return Promise.resolve(
			new GenericCollection<T>(this.collection<T>(...args), false)
		);
	}

	collection<T>(
		...args: Parameters<simpleDDP["collection"]>
	): ddpCollection<T> {
		return Wrapper.collection<unknown>(
			this.#client.collection.bind(this.#client),
			...args
		) as ddpCollection<T>;
	}

	async call<T>(method: string, ...args: any[]): Promise<T> {
		const result = await this.#client.call(method, ...args);
		return result as T;
	}

	subscribe(
		...args: Parameters<simpleDDP["subscribe"]>
	): Promise<Subscription> {
		return Promise.resolve(
			new MainThreadSubscription(this.#client.subscribe(...args))
		);
	}
}

export default MainThreadWrapper;
