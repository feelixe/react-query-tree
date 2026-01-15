import type { MutationKey, QueryKey } from "@tanstack/react-query";
import type { DeepPartial } from "./types";

export type Collection<T> = {
	[K in keyof T]: T[K] extends { "~type": "query" }
		? T[K]
		: T[K] extends { "~type": "mutation" }
			? T[K]
			: T[K] extends (...args: any[]) => any
				? ReturnType<T[K]> extends { "~type": "query" }
					? T[K]
					: never
				: T[K] extends Record<string, any>
					? Collection<T[K]>
					: never;
};

export type OutputApi<T extends Collection<any>> = {
	[K in keyof T]: T[K] extends { "~type": "query" }
		? {
				queryOptions: () => T[K] & { queryKey: QueryKey };
				queryKey: () => QueryKey;
				pathKey: () => string[];
			}
		: T[K] extends { "~type": "mutation" }
			? {
					mutationOptions: () => T[K] & { mutationKey: MutationKey };
					mutationKey: () => MutationKey;
					pathKey: () => string[];
				}
			: T[K] extends (...args: any[]) => any
				? {
						queryOptions: (...args: Parameters<T[K]>) => ReturnType<T[K]> & { queryKey: QueryKey };
						queryKey: (...args: DeepPartial<Parameters<T[K]>>) => QueryKey;
						pathKey: () => string[];
					}
				: T[K] extends Record<string, any>
					? OutputApi<T[K]> & { pathKey: () => string[] }
					: never;
};

export const createCollection = <T extends Collection<T>>(config: T): T => {
	return config;
};

export function createClient<T extends Collection<T>>(config: T): OutputApi<T> {
	const createProxy = (proxyTarget: any, path: string[] = []): any => {
		return new Proxy(proxyTarget, {
			get(obj, prop) {
				if (typeof prop === "symbol" || prop === "toJSON") {
					return obj[prop];
				}
				const value = obj[prop];
				const currentPath = [...path, prop as string];

				if (prop === "pathKey") {
					return () => path;
				}

				if (value && typeof value === "object" && "queryFn" in value) {
					return {
						queryOptions: () => ({ ...value, queryKey: currentPath }),
						queryKey: () => currentPath,
						pathKey: () => currentPath,
					};
				}

				if (value && typeof value === "object" && "mutationFn" in value) {
					return {
						mutationOptions: () => ({ ...value, mutationKey: currentPath }),
						mutationKey: () => currentPath,
						pathKey: () => currentPath,
					};
				}

				if (typeof value === "function") {
					return {
						queryOptions: (...args: any[]) => ({
							...value(...args),
							queryKey: [...currentPath, ...args],
						}),
						queryKey: (...args: any[]) => [...currentPath, ...args],
						pathKey: () => currentPath,
					};
				}

				if (value && typeof value === "object") {
					return createProxy(value, currentPath);
				}

				return value;
			},
			set() {
				throw new Error("Cannot set properties on the api object");
			},
			ownKeys(target) {
				return Reflect.ownKeys(target);
			},
			getOwnPropertyDescriptor(target, prop) {
				return Reflect.getOwnPropertyDescriptor(target, prop);
			},
		});
	};

	return createProxy(config);
}
