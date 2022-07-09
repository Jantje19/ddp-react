import ReactDOM from "react-dom/client";
import React from "react";

import DDP, { DDPContextProvider } from "@lib/index";

import { App } from "./App";
import "./index.css";

const client = DDP({
	endpoint: "ws://localhost:8080",
	reconnectInterval: 5000,
});

window.client = client;

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<DDPContextProvider
			client={client}
			placeholder={
				<div className="h-screen flex items-center justify-center">
					<span>Loading...</span>
				</div>
			}
		>
			<App />
		</DDPContextProvider>
	</React.StrictMode>
);
