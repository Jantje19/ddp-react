import { ddpFilterOptions } from "simpleddp/options";
import React, { ReactNode } from "react";
import MainThreadWorkerWrapper from "./wrappers/mainThreadWorker";
import MainThreadWrapper from "./wrappers/mainThread";
declare const DDPContext: React.Context<MainThreadWorkerWrapper | MainThreadWrapper | undefined>;
export declare const DDPContextProvider: ({ children, client, placeholder, onError, }: {
    client: MainThreadWrapper | MainThreadWorkerWrapper;
    onError?: ((err: any) => void) | undefined;
    placeholder: ReactNode;
    children: ReactNode;
}) => JSX.Element;
export declare const useCache: {
    <T>(data: T, check?: (prev: T, curr: T) => boolean): T;
    array<T_1>(prev: T_1[], curr: T_1[]): boolean;
};
export declare const usePromise: <T>(factory: () => Promise<T>, deps: React.DependencyList) => {
    data: T | undefined;
    error: Error | undefined;
};
export declare const useCollection: <T>(name: string, settings?: ddpFilterOptions) => T[];
export declare type UseSubscriptionParams = [name: string, ...args: any];
export declare const useSubscription: (name: string, ...args: any[]) => {
    ready: boolean;
    error: Error | undefined;
};
export declare const useMethod: <T>(method: string, ...args: any[]) => {
    data: T | undefined;
    error: Error | undefined;
    loading: boolean;
    exec: () => Promise<unknown>;
};
export declare const generateId: () => string;
export default DDPContext;
//# sourceMappingURL=context.d.ts.map