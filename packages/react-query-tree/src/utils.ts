import type { UseMutationOptions } from "@tanstack/react-query";

export function mergeMutationOptions(...opts: (UseMutationOptions | undefined)[]) {
	const out: Record<string, any> = {};

	for (const opt of opts) {
		if (!opt) {
			continue;
		}
		for (const [key, value] of Object.entries(opt)) {
			const existing = out[key];

			if (value === undefined) {
				continue;
			}

			if (typeof value === "function" && typeof existing === "function") {
				out[key] = (...args: any[]) => {
					existing(...args);
					return value(...args);
				};
				continue;
			}
			out[key] = value;
		}
	}

	return out as UseMutationOptions;
}
