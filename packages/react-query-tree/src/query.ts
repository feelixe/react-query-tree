import {
	type DefaultError,
	type DefinedInitialDataOptions,
	type QueryKey,
	queryOptions,
	type UndefinedInitialDataOptions,
	type UnusedSkipTokenOptions,
} from "@tanstack/react-query";

export function query<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
>(
	options: Omit<UnusedSkipTokenOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey">,
): Omit<UnusedSkipTokenOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey"> & {
	"~type": "query";
};
export function query<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
>(
	options: Omit<DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey">,
): Omit<DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey"> & {
	"~type": "query";
};
export function query<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
>(
	options: Omit<UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey">,
): Omit<UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey"> & {
	"~type": "query";
};
export function query<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
>(
	options: any,
): (
	| Omit<UnusedSkipTokenOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey">
	| Omit<DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey">
	| Omit<UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey">
) & { "~type": "query" } {
	return { ...queryOptions(options), "~type": "query" } as any;
}

export type AnyQueryOptions = (
	| Omit<UndefinedInitialDataOptions<any, any, any, any>, "queryKey">
	| Omit<DefinedInitialDataOptions<any, any, any, any>, "queryKey">
	| Omit<UnusedSkipTokenOptions<any, any, any, any>, "queryKey">
) & {
	"~type": "query";
};
