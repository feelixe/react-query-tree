import { useMutation } from "@tanstack/react-query";
import { createClient } from "api";
import { mutation } from "mutation";

const api = createClient({
	users: {
		create: mutation({
			mutationFn: (args: { name: string }) => {
				return Promise.resolve({
					id: 123,
				});
			},
		}),
	},
});

export function Hej() {
	const hej = useMutation(
		api.users.create.mutationOptions({
			onMutate: (_) => {
				return {
					pelle: "masoud",
				};
			},
			onError: (err, vars, ctx) => {},
		}),
	);

	console.info(hej.data);

	return null;
}
