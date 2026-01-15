import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "./api";

export function App() {
	const postsQuery = useSuspenseQuery(api.authors);
	const authorQuery = useSuspenseQuery(api.authors.retrieve.queryOptions(1));

	return (
		<div>
			{postsQuery.data.map((post) => (
				<div key={post.id}>{post.name}</div>
			))}

			{JSON.stringify(authorQuery.data)}
		</div>
	);
}
