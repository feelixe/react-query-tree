import { createClient, mutation, query } from "react-query-tree";

export const api = createClient({
	authors: {
		list: query({
			queryFn: () => {
				return 123;
			},
		}),
		retrieve: (id: number) =>
			query({
				queryFn: () => {
					return id;
				},
			}),
	},
	posts: {
		list: query({
			queryFn: () => {
				return 123;
			},
		}),
		create: mutation({
			mutationFn: async (args: { title: string; content: string; authorId: number }) => {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				return args;
			},
		}),
	},
});
