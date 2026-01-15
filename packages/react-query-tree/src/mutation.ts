import { type DefaultError, mutationOptions, type UseMutationOptions } from "@tanstack/react-query";

export type MutationBrand = { "~type": "mutation" };

export const mutationBrand: MutationBrand = {
	"~type": "mutation",
};

export function mutation<
	TData = unknown,
	TError = DefaultError,
	TVariables = void,
	TOnMutateResult = unknown,
>(
	options: Omit<UseMutationOptions<TData, TError, TVariables, TOnMutateResult>, "mutationKey">,
): Omit<UseMutationOptions<TData, TError, TVariables, TOnMutateResult>, "mutationKey"> &
	MutationBrand {
	return { ...mutationOptions(options), ...mutationBrand };
}

export type AnyMutationOptions = Omit<UseMutationOptions<any, any, any, any>, "mutationKey">;
