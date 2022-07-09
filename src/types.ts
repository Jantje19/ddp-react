import { ddpReactiveCollection } from "simpleddp/classes/ddpReactiveCollection";
import { ddpCollection } from "simpleddp/classes/ddpCollection";
import { ddpOnChange } from "simpleddp/classes/ddpOnChange";
import simpleDDP from "simpleddp";
import { proxy } from "comlink";

export interface Subscription {
	ready(): Promise<void>;
	remove(): Promise<void>;
}

export type CollectionChangeListener<T> = (data: T[]) => void;
export type CollectionChangeResponse = { stop: () => void };
export interface Collection<T> {
	fetch(...args: Parameters<ddpCollection<T>["fetch"]>): Promise<T[]>;
	setOnChange(
		cb: CollectionChangeListener<T>,
		args: Parameters<ddpCollection<T>["reactive"]>
	): Promise<CollectionChangeResponse>;
}

export const isObject = (v: any) => v && typeof v === "object";
export const isSameObject = (
	a: Record<string, unknown>,
	b: Record<string, unknown>
): boolean => {
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);

	if (!isSameArray(aKeys, bKeys)) {
		return false;
	}

	return aKeys.every((key): boolean => {
		const aVal = a[key];
		const bVal = b[key];

		if (Array.isArray(aVal)) {
			if (!Array.isArray(bVal)) {
				return false;
			}
			return isSameArray(aVal, bVal);
		}
		if (isObject(aVal)) {
			if (!isObject(bVal)) {
				return false;
			}
			return isSameObject(
				aVal as Record<string, unknown>,
				bVal as Record<string, unknown>
			);
		}
		return aVal === bVal;
	});
};
export const isSameArray = (a: any[], b: any[]): boolean => {
	if (a.length !== b.length) {
		return false;
	}

	return a.every((value, i) => {
		const bVal = b[i];

		if (Array.isArray(value)) {
			if (!Array.isArray(bVal)) {
				return false;
			}
			return isSameArray(value, bVal);
		}
		if (isObject(value)) {
			if (!isObject(bVal)) {
				return false;
			}
			return isSameObject(value, bVal);
		}
		return value === bVal;
	});
};

export class GenericCollection<T> implements Collection<T> {
	#reactive: ddpReactiveCollection<T> | undefined;
	#onChange: ddpOnChange | undefined;
	#collection: ddpCollection<T>;
	#isWorker: boolean;

	constructor(collection: ddpCollection<T>, isWorker: boolean) {
		this.#collection = collection;
		this.#isWorker = isWorker;
	}

	async fetch(...args: Parameters<ddpCollection<T>["fetch"]>) {
		return this.internalFetch(...args);
	}

	async setOnChange(
		cb: CollectionChangeListener<T>,
		args: Parameters<ddpCollection<T>["fetch"]>
	) {
		this.#onChange?.stop();
		this.#reactive?.stop();

		this.#reactive = this.#collection.reactive(...args);

		let prevVal = this.internalFetch(...args);
		// @ts-ignore
		this.#onChange = this.#reactive.onChange((data) => {
			if (this.#isWorker && "structuredClone" in self) {
				if (isSameArray(prevVal, data)) {
					return;
				}
				prevVal = structuredClone(data);
			}

			cb(data);
		});

		cb(prevVal);

		return proxy({
			stop: () => {
				this.#onChange?.stop();
				this.#reactive?.stop();
			},
		});
	}

	private internalFetch(...args: Parameters<ddpCollection<T>["fetch"]>) {
		return this.#collection.fetch(...args) as T[];
	}
}

const collections: Map<string, ddpCollection<any>> = new Map();
export abstract class Wrapper {
	abstract connect(): Promise<void>;
	abstract internalCollection<T>(
		...args: Parameters<simpleDDP["collection"]>
	): Promise<Collection<T>>;
	abstract collection<T>(
		...args: Parameters<simpleDDP["collection"]>
	): ddpCollection<T> | Promise<Collection<T>>;
	abstract call<T>(...args: Parameters<simpleDDP["call"]>): Promise<T>;
	abstract subscribe(
		...args: Parameters<simpleDDP["subscribe"]>
	): Promise<Subscription>;

	static collection<T>(
		createCollection: (
			...args: Parameters<simpleDDP["collection"]>
		) => ddpCollection<T>,
		...args: Parameters<simpleDDP["collection"]>
	): ddpCollection<T> {
		const [name] = args;

		const existing = collections.get(name);
		if (existing) {
			return existing;
		}

		const newCollection = createCollection(...args);
		collections.set(name, newCollection);
		return newCollection;
	}
}
