import { ddpSubscription } from "simpleddp/classes/ddpSubscription";
import { ddpCollection } from "simpleddp/classes/ddpCollection";
import simpleDDP from "simpleddp";
import { GenericCollection, Subscription, Wrapper } from "../types";
export declare class WorkerSubscription implements Subscription {
    #private;
    constructor(subscription: ddpSubscription);
    ready(): Promise<void>;
    remove(): Promise<void>;
}
declare class WorkerWrapper implements Wrapper {
    #private;
    constructor(client: simpleDDP);
    connect(): Promise<void>;
    internalCollection<T>(...args: Parameters<Wrapper["internalCollection"]>): Promise<GenericCollection<T>>;
    collection<T>(...args: Parameters<simpleDDP["collection"]>): ddpCollection<T>;
    call<T>(method: string, ...args: any[]): Promise<T>;
    subscribe(pubname: string, ...args: any[]): Promise<WorkerSubscription>;
}
export default WorkerWrapper;
//# sourceMappingURL=worker.d.ts.map