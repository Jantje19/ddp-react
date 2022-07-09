import { proxy } from "comlink";
export class MainThreadWorkerCollection {
    #collection;
    constructor(collection) {
        this.#collection = collection;
    }
    async fetch(...args) {
        return this.#collection.fetch(...args);
    }
    async setOnChange(cb, args) {
        return this.#collection.setOnChange(proxy(cb), args);
    }
}
class MainThreadWorkerWrapper {
    #worker;
    constructor(worker) {
        this.#worker = worker;
    }
    connect() {
        return this.#worker.connect();
    }
    async internalCollection(...args) {
        const collection = await this.collection(...args);
        return new MainThreadWorkerCollection(collection);
    }
    async collection(...args) {
        const collection = await this.#worker.internalCollection(...args);
        return collection;
    }
    async call(method, ...args) {
        const result = await this.#worker.call(method, ...args);
        return result;
    }
    subscribe(...args) {
        return this.#worker.subscribe(...args);
    }
}
export default MainThreadWorkerWrapper;
