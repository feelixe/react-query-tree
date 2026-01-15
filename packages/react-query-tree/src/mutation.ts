import { type DefaultError, mutationOptions, type UseMutationOptions } from "@tanstack/react-query";

export function mutation<
	TData = unknown,
	TError = DefaultError,
	TVariables = void,
	TOnMutateResult = unknown,
>(
	options: Omit<UseMutationOptions<TData, TError, TVariables, TOnMutateResult>, "mutationKey">,
): Omit<UseMutationOptions<TData, TError, TVariables, TOnMutateResult>, "mutationKey"> & {
	"~type": "mutation";
} {
	return { ...mutationOptions(options), "~type": "mutation" };
}

export type AnyMutationOptions = Omit<UseMutationOptions<any, any, any, any>, "mutationKey">;
