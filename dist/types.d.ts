import { ddpCollection } from "simpleddp/classes/ddpCollection";
import simpleDDP from "simpleddp";
export interface Subscription {
    ready(): Promise<void>;
    remove(): Promise<void>;
}
export declare type CollectionChangeListener<T> = (data: T[]) => void;
export declare type CollectionChangeResponse = {
    stop: () => void;
};
export interface Collection<T> {
    fetch(...args: Parameters<ddpCollection<T>["fetch"]>): Promise<T[]>;
    setOnChange(cb: CollectionChangeListener<T>, args: Parameters<ddpCollection<T>["reactive"]>): Promise<CollectionChangeResponse>;
}
export declare const isObject: (v: any) => any;
export declare const isSameObject: (a: Record<string, unknown>, b: Record<string, unknown>) => boolean;
export declare const isSameArray: (a: any[], b: any[]) => boolean;
export declare class GenericCollection<T> implements Collection<T> {
    #private;
    constructor(collection: ddpCollection<T>, isWorker: boolean);
    fetch(...args: Parameters<ddpCollection<T>["fetch"]>): Promise<T[]>;
    setOnChange(cb: CollectionChangeListener<T>, args: Parameters<ddpCollection<T>["fetch"]>): Promise<{
        stop: () => void;
    } & import("comlink").ProxyMarked>;
    private internalFetch;
}
export declare abstract class Wrapper {
    abstract connect(): Promise<void>;
    abstract internalCollection<T>(...args: Parameters<simpleDDP["collection"]>): Promise<Collection<T>>;
    abstract collection<T>(...args: Parameters<simpleDDP["collection"]>): ddpCollection<T> | Promise<Collection<T>>;
    abstract call<T>(...args: Parameters<simpleDDP["call"]>): Promise<T>;
    abstract subscribe(...args: Parameters<simpleDDP["subscribe"]>): Promise<Subscription>;
    static collection<T>(createCollection: (...args: Parameters<simpleDDP["collection"]>) => ddpCollection<T>, ...args: Parameters<simpleDDP["collection"]>): ddpCollection<T>;
}
//# sourceMappingURL=types.d.ts.map