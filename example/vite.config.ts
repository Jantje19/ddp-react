import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		fs: {
			// Allow serving files from one level up to the project root
			allow: [".."],
		},
	},
	resolve: {
		alias: {
			"@lib": resolve(__dirname, "../src"),
		},
	},
});
