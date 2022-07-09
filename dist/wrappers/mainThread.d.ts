import { ddpSubscription } from "simpleddp/classes/ddpSubscription";
import { ddpCollection } from "simpleddp/classes/ddpCollection";
import simpleDDP from "simpleddp";
import { Collection, Subscription, Wrapper } from "../types";
export declare class MainThreadSubscription implements Subscription {
    #private;
    constructor(subscription: ddpSubscription);
    ready(): Promise<void>;
    remove(): Promise<void>;
}
declare class MainThreadWrapper implements Wrapper {
    #private;
    constructor(client: simpleDDP);
    connect(): Promise<void>;
    internalCollection<T>(...args: Parameters<simpleDDP["collection"]>): Promise<Collection<T>>;
    collection<T>(...args: Parameters<simpleDDP["collection"]>): ddpCollection<T>;
    call<T>(method: string, ...args: any[]): Promise<T>;
    subscribe(...args: Parameters<simpleDDP["subscribe"]>): Promise<Subscription>;
}
export default MainThreadWrapper;
//# sourceMappingURL=mainThread.d.ts.map