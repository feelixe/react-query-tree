import { createClient, createCollection, mutation, query } from "react-query-tree";
import { createPost, getAuthorById, listAuthors, listPosts } from "./db";

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
	create: mutation({
		mutationFn: async (args: { title: string; content: string; authorId: number }) => {
			return await createPost(args);
		},
	}),
});

export const api = createClient({
	authors: authorsCollection,
	posts: postsCollection,
});
