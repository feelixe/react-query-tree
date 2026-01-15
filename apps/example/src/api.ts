import { createClient, createCollection, query } from "react-query-tree";
import { getAuthorById, listAuthors, listPosts } from "./db";

const authorsCollection = createCollection({
	list: query({
		queryFn: async () => {
			return await listAuthors();
		},
	}),
	retrieve: (id: number) =>
		query({
			queryFn: async () => {
				return await getAuthorById(id);
			},
		}),
});

const postsCollection = createCollection({
	list: query({
		queryFn: async () => {
			return await listPosts();
		},
	}),
});

export const api = createClient({
	authors: authorsCollection,
	posts: postsCollection,
});
