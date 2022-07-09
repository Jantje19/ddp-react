import { proxy } from "comlink";
export const isObject = (v) => v && typeof v === "object";
export const isSameObject = (a, b) => {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (!isSameArray(aKeys, bKeys)) {
        return false;
    }
    return aKeys.every((key) => {
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
            return isSameObject(aVal, bVal);
        }
        return aVal === bVal;
    });
};
export const isSameArray = (a, b) => {
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
export class GenericCollection {
    #reactive;
    #onChange;
    #collection;
    #isWorker;
    constructor(collection, isWorker) {
        this.#collection = collection;
        this.#isWorker = isWorker;
    }
    async fetch(...args) {
        return this.internalFetch(...args);
    }
    async setOnChange(cb, args) {
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
    internalFetch(...args) {
        return this.#collection.fetch(...args);
    }
}
const collections = new Map();
export class Wrapper {
    static collection(createCollection, ...args) {
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
