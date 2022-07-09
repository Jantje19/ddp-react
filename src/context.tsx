import { ddpFilterOptions } from "simpleddp/options";
import simpleDDP from "simpleddp";
import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import MainThreadWorkerWrapper from "./wrappers/mainThreadWorker";
import { CollectionChangeResponse, Subscription } from "./types";
import MainThreadWrapper from "./wrappers/mainThread";

const DDPContext = createContext<
	MainThreadWrapper | MainThreadWorkerWrapper | undefined
>(undefined);

export const DDPContextProvider = ({
	children,
	client,
	placeholder,
	onError,
}: {
	client: MainThreadWrapper | MainThreadWorkerWrapper;
	onError?: (err: any) => void;
	placeholder: ReactNode;
	children: ReactNode;
}): JSX.Element => {
	const [error, setError] = useState<Error | undefined>(undefined);
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		let ignore = false;

		setConnected(false);
		setError(undefined);

		client
			.connect()
			.then(() => {
				if (!ignore) {
					setConnected(true);
				}
			})
			.catch((err: Error) => {
				console.error(err);
				if (!ignore) {
					onError?.(err);
					setError(err);
				}
			});

		return () => {
			ignore = true;
		};
	}, []);

	if (!connected && placeholder) {
		return <>{placeholder}</>;
	}

	if (error) {
		return <p>Error: {error.message ?? error.toString()}</p>;
	}

	return <DDPContext.Provider value={client}>{children}</DDPContext.Provider>;
};

export const useCache = <T,>(
	data: T,
	check: (prev: T, curr: T) => boolean = (prev, curr) => prev === curr
): T => {
	const [value, setValue] = useState(data);

	useEffect(() => {
		let ignore = false;

		if (!check(value, data) && !ignore) {
			setValue(data);
		}

		return () => {
			ignore = true;
		};
	}, [data]);

	return value;
};
useCache.array = <T,>(prev: T[], curr: T[]) =>
	curr.every((entry, index) => prev[index] === entry);

export const usePromise = <T,>(
	factory: () => Promise<T>,
	deps: React.DependencyList
) => {
	const [error, setError] = useState<Error | undefined>();
	const [data, setData] = useState<T | undefined>();

	const promise = useMemo(factory, deps);

	useEffect(() => {
		let ignore = false;

		promise
			.then((result) => {
				if (!ignore) {
					setData(result);
				}
			})
			.catch((err) => {
				if (!ignore) {
					setError(err);
				}
			});

		return () => {
			ignore = true;
		};
	}, [promise]);

	return { data, error };
};

export const useCollection = <T,>(
	name: string,
	settings: ddpFilterOptions = {}
) => {
	const client = useContext(DDPContext)!;

	const { data: collection } = usePromise(
		async () => client.internalCollection<T>(name),
		[client, name]
	);

	const cachedCollection = useCache(collection);

	const listener = useRef<CollectionChangeResponse | undefined>();

	const [data, setData] = useState<T[]>([]);

	useEffect(() => {
		if (!collection || cachedCollection === collection) {
			return;
		}

		collection
			.setOnChange(setData, [settings])
			.then((response) => {
				listener.current = response;
			})
			.catch(console.error);

		return () => listener.current?.stop();
	}, [cachedCollection, settings]);

	return data;
};

export type UseSubscriptionParams = [name: string, ...args: any];
export const useSubscription = (...args: UseSubscriptionParams) => {
	const [error, setError] = useState<Error | undefined>(undefined);
	const [ready, setReady] = useState(false);

	const client = useContext(DDPContext)!;
	const cachedArgs = useCache<UseSubscriptionParams>(args, useCache.array);

	const subscription = useRef<Subscription>();

	useEffect(() => {
		let ignore = false;

		subscription.current?.remove();

		setError(undefined);
		setReady(false);

		(async () => {
			subscription.current = await client.subscribe(...cachedArgs);
			if (!ignore) {
				await subscription.current.ready();
			}
		})()
			.then(() => {
				if (!ignore) {
					setReady(true);
				}
			})
			.catch((err) => {
				if (!ignore) {
					setError(err);
				}
			});

		return () => {
			ignore = true;
			subscription.current?.remove();
		};
	}, [cachedArgs]);

	return { ready, error };
};

export const useMethod = <T,>(...args: Parameters<simpleDDP["call"]>) => {
	const [error, setError] = useState<Error | undefined>();
	const [data, setData] = useState<T | undefined>();
	const [loading, setLoading] = useState(false);

	const client = useContext(DDPContext)!;

	const exec = useCallback(() => {
		setLoading(true);
		setError(undefined);

		return client
			.call(...args)
			.then((result) => {
				setData(result as T);
				return result;
			})
			.catch((err) => {
				setError(err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [args, client]);

	return { data, error, loading, exec };
};

export const generateId = () => crypto.randomUUID();

export default DDPContext;
