import { GenericCollection, Wrapper } from "../types";
export class MainThreadSubscription {
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
class MainThreadWrapper {
    #client;
    constructor(client) {
        this.#client = client;
    }
    connect() {
        return this.#client.connect();
    }
    internalCollection(...args) {
        return Promise.resolve(new GenericCollection(this.collection(...args), false));
    }
    collection(...args) {
        return Wrapper.collection(this.#client.collection.bind(this.#client), ...args);
    }
    async call(method, ...args) {
        const result = await this.#client.call(method, ...args);
        return result;
    }
    subscribe(...args) {
        return Promise.resolve(new MainThreadSubscription(this.#client.subscribe(...args)));
    }
}
export default MainThreadWrapper;
