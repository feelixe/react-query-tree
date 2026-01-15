const db = {
	authors: [
		{
			id: 1,
			name: "John Doe",
		},
	],
	posts: [
		{
			id: 1,
			title: "Post 1",
			content: "Content 1",
			authorId: 1,
		},
	],
};

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAuthorById(id: number) {
	await delay(1000);
	return db.authors.find((author) => author.id === id);
}

export async function listAuthors() {
	await delay(1000);
	return db.authors;
}

export async function listPosts() {
	await delay(1000);
	return db.posts;
}

export async function getPostById(id: number) {
	await delay(1000);
	return db.posts.find((post) => post.id === id);
}

export async function createPost(post: { title: string; content: string; authorId: number }) {
	await delay(1000);
	db.posts.push({
		id: Date.now(),
		...post,
	});
	return db.posts[db.posts.length - 1];
}
