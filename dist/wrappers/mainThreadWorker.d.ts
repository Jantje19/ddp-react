import { ddpCollection } from "simpleddp/classes/ddpCollection";
import { Remote } from "comlink";
import simpleDDP from "simpleddp";
import { Collection, CollectionChangeListener, Subscription, Wrapper } from "../types";
export declare class MainThreadWorkerCollection<T> implements Collection<T> {
    #private;
    constructor(collection: Collection<T>);
    fetch(...args: Parameters<Collection<T>["fetch"]>): Promise<T[]>;
    setOnChange(cb: CollectionChangeListener<T>, args: Parameters<ddpCollection<T>["reactive"]>): Promise<import("../types").CollectionChangeResponse>;
}
declare class MainThreadWorkerWrapper implements Wrapper {
    #private;
    constructor(worker: Remote<Wrapper>);
    connect(): Promise<void>;
    internalCollection<T>(...args: Parameters<simpleDDP["collection"]>): Promise<Collection<T>>;
    collection<T>(...args: Parameters<Wrapper["collection"]>): Promise<Collection<T>>;
    call<T>(method: string, ...args: any[]): Promise<T>;
    subscribe(...args: Parameters<Wrapper["subscribe"]>): Promise<Subscription>;
}
export default MainThreadWorkerWrapper;
//# sourceMappingURL=mainThreadWorker.d.ts.map