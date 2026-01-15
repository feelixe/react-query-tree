import { createClient, mutation, query } from "react-query-tree";
import { getAuthorById, listAuthors, listPosts } from "./db";

export const api = createClient({
	authors: {
		list: query({
			queryFn: () => {
				return listAuthors();
			},
		}),
		retrieve: (id: number) =>
			query({
				queryFn: () => {
					return getAuthorById(id);
				},
			}),
	},
	posts: {
		list: query({
			queryFn: () => {
				return listPosts();
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
