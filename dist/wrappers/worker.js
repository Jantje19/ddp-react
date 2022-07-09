import { proxy } from "comlink";
import { GenericCollection, Wrapper } from "../types";
export class WorkerSubscription {
    #subscription;
    constructor(subscription) {
        this.#subscription = subscription;
    }
    ready() {
        return this.#subscription.ready();
    }
    remove() {
        return Promise.resolve(this.#subscription.remove());
    }
}
class WorkerWrapper {
    #client;
    constructor(client) {
        this.#client = client;
    }
    connect() {
        return this.#client.connect();
    }
    internalCollection(...args) {
        return Promise.resolve(proxy(new GenericCollection(this.collection(...args), true)));
    }
    collection(...args) {
        return Wrapper.collection(this.#client.collection.bind(this.#client), ...args);
    }
    async call(method, ...args) {
        const result = await this.#client.call(method, ...args);
        return result;
    }
    subscribe(pubname, ...args) {
        return Promise.resolve(proxy(new WorkerSubscription(this.#client.subscribe(pubname, ...args))));
    }
}
export default WorkerWrapper;
