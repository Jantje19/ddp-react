# DDP React

React hooks for the [custom DDP project](https://github.com/Jantje19/ddp), however these hooks should work with any DDP server (even Meteor).

## Usage

### Workerized (auto)

This is the simplest (and recommended) solution but does not offer a great deal of flexibility.
The returned `client` object only contains the necessary features to drive the hooks.

It is recommended that you only use this client as a parameter to the `DDPContextProvider`.
If you want to execute methods manually (without the provided hooks) look at the options below.

```tsx
import DDP, { DDPContextProvider } from "ddp";

const client = DDP(options);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<DDPContextProvider client={client} placeholder="Loading...">
			<App />
		</DDPContextProvider>
	</React.StrictMode>
);
```

### Workerized (manual)

Provides more flexibility by exposing the `simpleDDP` construction while still running off the main thread, but comes with the complexity of setting up the worker.

#### Main thread

```tsx
import { mainThreadWrapper, DDPContextProvider } from "ddp";
import ReactDOM from "react-dom/client";

const worker = new Worker(new URL(path, import.meta.url), { type: "module" });
// Don't do this in a component or use the `useMemo` hook
const client = mainThreadWrapper(worker);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<DDPContextProvider client={client} placeholder="Loading...">
			<App />
		</DDPContextProvider>
	</React.StrictMode>
);
```

#### Worker

```typescript
import { workerWrapper, WorkerWrapper } from "ddp";
import simpleDDP from "simpleDDP";

const client = new simpleDDP(options);
const wrappedClient = workerWrapper(client) as WorkerWrapper;

// Because simpleDDP does not deduplicate collections, you need to use the wrapped client to create them!
const collection = wrappedClient.collection("collection name");

// Do stuff with the client...
```

### Main tread

Most flexible solution, but does not get the benefits of running on a separate thread.

```tsx
import { mainThreadWrapper, MainThreadWrapper, DDPContextProvider } from "ddp";
import ReactDOM from "react-dom/client";
import simpleDDP from "simpleDDP";

const client = new simpleDDP(options);
// Don't do this in a component or use the `useMemo` hook
const wrappedClient = mainThreadWrapper(client) as MainThreadWrapper;

// Because simpleDDP does not deduplicate collections, you need to use the wrapped client to create them!
const collection = wrappedClient.collection("collection name");

// Do stuff with the client...

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<DDPContextProvider client={wrappedClient} placeholder="Loading...">
			<App />
		</DDPContextProvider>
	</React.StrictMode>
);
```
