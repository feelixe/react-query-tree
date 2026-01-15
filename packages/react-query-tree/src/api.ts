import type {
	DefinedInitialDataOptions,
	MutationKey,
	QueryKey,
	UndefinedInitialDataOptions,
	UnusedSkipTokenOptions,
	UseMutationOptions,
} from "@tanstack/react-query";
import { type MutationBrand, mutationBrand } from "mutation";
import { type QueryBrand, queryBrand } from "query";
import { mergeMutationOptions } from "utils";
import type { DeepPartial } from "./types";

export type Collection = {
	[key: string]: QueryBrand | MutationBrand | ((filter: any) => QueryBrand) | Collection;
};

type Query<T> =
	T extends Omit<
		DefinedInitialDataOptions<infer TQueryFnData, infer TError, infer TData> & QueryBrand,
		"queryKey"
	>
		? {
				queryOptions: <TInnerData = TData>(
					opts?: Partial<
						Omit<DefinedInitialDataOptions<TQueryFnData, TError, TInnerData>, "queryKey">
					>,
				) => Omit<DefinedInitialDataOptions<TQueryFnData, TError, TInnerData>, "queryKey"> & {
					queryKey: QueryKey;
				};
				queryKey: () => QueryKey;
				pathKey: () => string[];
			}
		: T extends Omit<
					UnusedSkipTokenOptions<infer TQueryFnData, infer TError, infer TData> & QueryBrand,
					"queryKey"
				>
			? {
					queryOptions: <TInnerData = TData>(
						opts?: Omit<UnusedSkipTokenOptions<TQueryFnData, TError, TInnerData>, "queryKey">,
					) => Omit<UnusedSkipTokenOptions<TQueryFnData, TError, TInnerData>, "queryKey"> & {
						queryKey: QueryKey;
					};
					queryKey: () => QueryKey;
					pathKey: () => string[];
				}
			: T extends Omit<
						UndefinedInitialDataOptions<infer TQueryFnData, infer TError, infer TData> & QueryBrand,
						"queryKey"
					>
				? {
						queryOptions: <TInnerData = TData>(
							opts?: Omit<
								UndefinedInitialDataOptions<TQueryFnData, TError, TInnerData>,
								"queryKey"
							>,
						) => Omit<UndefinedInitialDataOptions<TQueryFnData, TError, TInnerData>, "queryKey"> & {
							queryKey: QueryKey;
						};
						queryKey: () => QueryKey;
						pathKey: () => string[];
					}
				: never;

type QueryWithFilter<T extends (filter: any) => any> =
	ReturnType<T> extends Omit<
		DefinedInitialDataOptions<infer TQueryFnData, infer TError, infer TData> & QueryBrand,
		"queryKey"
	>
		? {
				queryOptions: <TInnerData = TData>(
					filter: Parameters<T>[0],
					opts?: Partial<
						Omit<DefinedInitialDataOptions<TQueryFnData, TError, TInnerData>, "queryKey">
					>,
				) => ReturnType<T> & { queryKey: QueryKey };
				queryKey: (filter?: DeepPartial<Parameters<T>[0]>) => QueryKey;
				pathKey: () => string[];
			}
		: ReturnType<T> extends Omit<
					UnusedSkipTokenOptions<infer TQueryFnData, infer TError, infer TData> & QueryBrand,
					"queryKey"
				>
			? {
					queryOptions: <TInnerData = TData>(
						filter: Parameters<T>[0],
						opts?: Omit<UnusedSkipTokenOptions<TQueryFnData, TError, TInnerData>, "queryKey">,
					) => ReturnType<T> & { queryKey: QueryKey };
					queryKey: (filter?: DeepPartial<Parameters<T>[0]>) => QueryKey;
					pathKey: () => string[];
				}
			: ReturnType<T> extends Omit<
						UndefinedInitialDataOptions<infer TQueryFnData, infer TError, infer TData> & QueryBrand,
						"queryKey"
					>
				? {
						queryOptions: <TInnerData = TData>(
							filter: Parameters<T>[0],
							opts?: Omit<
								UndefinedInitialDataOptions<TQueryFnData, TError, TInnerData>,
								"queryKey"
							>,
						) => ReturnType<T> & { queryKey: QueryKey };
						queryKey: (filter?: DeepPartial<Parameters<T>[0]>) => QueryKey;
						pathKey: () => string[];
					}
				: never;

type Mutation<T> =
	T extends Omit<
		UseMutationOptions<infer TData, infer TError, infer TVariables, infer TContext>,
		"mutationKey"
	>
		? {
				mutationOptions: <TInnerContext = TContext>(
					opts?: Omit<
						UseMutationOptions<TData, TError, TVariables, TInnerContext>,
						"mutationKey" | "mutationFn"
					>,
				) => Omit<UseMutationOptions<TData, TError, TVariables, TContext>, "mutationKey"> & {
					mutationKey: MutationKey;
				};
				mutationKey: () => MutationKey;
				pathKey: () => string[];
			}
		: never;

export type OutputApi<T extends Collection> = {
	[K in keyof T]: T[K] extends { "~type": "query" }
		? Query<T[K]>
		: T[K] extends { "~type": "mutation" }
			? Mutation<T[K]>
			: T[K] extends (filter: any) => any
				? QueryWithFilter<T[K]>
				: T[K] extends Record<string, any>
					? OutputApi<T[K]> & { pathKey: () => string[] }
					: never;
};

export const createCollection = <T extends Collection>(config: T): T => {
	return config;
};

type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export function createClient<T extends Collection>(config: T): Prettify<OutputApi<T>> {
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

				if (value && typeof value === "object" && value["~type"] === queryBrand["~type"]) {
					return {
						queryOptions: (opts?: any) => ({ ...value, queryKey: currentPath, ...opts }),
						queryKey: () => currentPath,
						pathKey: () => currentPath,
					};
				}

				if (value && typeof value === "object" && value["~type"] === mutationBrand["~type"]) {
					return {
						mutationOptions: (opts?: any) =>
							mergeMutationOptions(value, { mutationKey: currentPath }, opts),
						mutationKey: () => currentPath,
						pathKey: () => currentPath,
					};
				}

				if (typeof value === "function") {
					return {
						queryOptions: (filter: any, opts?: any) => ({
							...value(filter),
							queryKey: [...currentPath, filter],
							...opts,
						}),
						queryKey: (filter?: any) => [...currentPath, filter],
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
