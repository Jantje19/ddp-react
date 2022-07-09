import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, } from "react";
const DDPContext = createContext(undefined);
export const DDPContextProvider = ({ children, client, placeholder, onError, }) => {
    const [error, setError] = useState(undefined);
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
            .catch((err) => {
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
export const useCache = (data, check = (prev, curr) => prev === curr) => {
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
useCache.array = (prev, curr) => curr.every((entry, index) => prev[index] === entry);
export const usePromise = (factory, deps) => {
    const [error, setError] = useState();
    const [data, setData] = useState();
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
export const useCollection = (name, settings = {}) => {
    const client = useContext(DDPContext);
    const { data: collection } = usePromise(async () => client.internalCollection(name), [client, name]);
    const cachedCollection = useCache(collection);
    const listener = useRef();
    const [data, setData] = useState([]);
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
export const useSubscription = (...args) => {
    const [error, setError] = useState(undefined);
    const [ready, setReady] = useState(false);
    const client = useContext(DDPContext);
    const cachedArgs = useCache(args, useCache.array);
    const subscription = useRef();
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
export const useMethod = (...args) => {
    const [error, setError] = useState();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const client = useContext(DDPContext);
    const exec = useCallback(() => {
        setLoading(true);
        setError(undefined);
        return client
            .call(...args)
            .then((result) => {
            setData(result);
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
