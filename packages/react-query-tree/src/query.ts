import {
	type DefaultError,
	type DefinedInitialDataOptions,
	type QueryKey,
	queryOptions,
	type UndefinedInitialDataOptions,
	type UnusedSkipTokenOptions,
} from "@tanstack/react-query";

export type QueryBrand = {
	"~type": "query";
};

export const queryBrand = {
	"~type": "query",
};

export function query<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
>(
	options: Omit<DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey">,
): Omit<DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey"> & QueryBrand;
export function query<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
>(
	options: Omit<UnusedSkipTokenOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey">,
): Omit<UnusedSkipTokenOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey"> & QueryBrand;
export function query<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
>(
	options: Omit<UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey">,
): Omit<UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey"> &
	QueryBrand;
export function query<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
>(
	options: any,
): (
	| Omit<DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey">
	| Omit<UnusedSkipTokenOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey">
	| Omit<UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey">
) &
	QueryBrand {
	return { ...queryOptions(options), ...queryBrand } as any;
}
