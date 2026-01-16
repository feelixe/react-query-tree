import { describe, expect, it, mock } from "bun:test";
import { createApi } from "../api";
import { mutation } from "../mutation";
import { query } from "../query";

describe("createApi", () => {
	it("handles nested APIs", () => {
		const usersApi = createApi({
			list: query({
				queryFn: () => ["user1", "user2"],
			}),
		});

		const postsApi = createApi({
			create: mutation({
				mutationFn: async (vars: { id: number }) => vars,
			}),
		});

		const api = createApi({
			users: usersApi,
			posts: postsApi,
		});

		expect(api.posts.create.mutationOptions().mutationFn).toBe(
			postsApi.create.mutationOptions().mutationFn,
		);
		expect(api.users.list.queryOptions().queryFn).toEqual(usersApi.list.queryOptions().queryFn);

		expect(api.posts.create.mutationKey()).toEqual(["posts", "create"]);
		expect(api.users.list.queryKey()).toEqual(["users", "list"]);

		expect(api.posts.pathKey()).toEqual(["posts"]);
		expect(api.users.pathKey()).toEqual(["users"]);
	});

	it("queries have a queryKey function that returns the query key", () => {
		const api = createApi({
			users: {
				list: query({
					queryFn: () => ["user1", "user2"],
				}),
			},
		});

		expect(api.users.list.queryKey()).toEqual(["users", "list"]);
	});

	it("queries have a queryOptions function that returns the query options", () => {
		const options = {
			users: {
				list: query({
					queryFn: () => ["user1", "user2"],
				}),
			},
		};
		const api = createApi(options);
		expect(api.users.list.queryOptions().queryFn).toEqual(options.users.list.queryFn);
	});

	it("queries have a pathKey function that returns the path key", () => {
		const options = {
			users: {
				list: query({
					queryFn: () => ["user1", "user2"],
				}),
			},
		};
		const api = createApi(options);
		expect(api.users.list.pathKey()).toEqual(["users", "list"]);
	});

	it("mutations have a mutationKey function that returns the mutation key", () => {
		const api = createApi({
			auth: {
				login: mutation({
					mutationFn: async (vars: { id: number }) => vars,
				}),
			},
		});
		expect(api.auth.login.mutationKey()).toEqual(["auth", "login"]);
	});

	it("mutations have a mutationOptions function that returns the mutation options", () => {
		const options = {
			auth: {
				login: mutation({
					mutationFn: async (vars: { id: number }) => vars,
				}),
			},
		};
		const api = createApi(options);
		expect(api.auth.login.mutationOptions().mutationFn).toEqual(options.auth.login.mutationFn);
	});

	it("mutations have a pathKey function that returns the path key", () => {
		const options = {
			auth: {
				login: mutation({
					mutationFn: async (vars: { id: number }) => vars,
				}),
			},
		};
		const api = createApi(options);
		expect(api.auth.login.pathKey()).toEqual(["auth", "login"]);
	});

	it("queries that accept a filter argument have a queryKey function that returns the query key with the filter argument", () => {
		const api = createApi({
			posts: {
				detail: (id: number) =>
					query({
						queryFn: () => ({ id, title: "Bun Test" }),
					}),
			},
		});

		expect(api.posts.detail.queryKey(42)).toEqual(["posts", "detail", 42]);
	});

	it("queries that accept a filter argument have a queryOptions function that returns the query options with the filter argument", () => {
		const options = {
			posts: {
				detail: (id: number) =>
					query({
						queryFn: () => ({ id, title: "Bun Test" }),
					}),
			},
		};
		const api = createApi(options);

		const expected = options.posts.detail(42);
		const actual = api.posts.detail.queryOptions(42);

		expect(actual.queryFn?.({} as any)).toEqual(expected.queryFn?.({} as any));
	});

	it("nested queries have a queryKey function that returns the query key with the nested path", () => {
		const api = createApi({
			settings: {
				profile: {
					get: query({
						queryFn: () => ({ name: "Alice" }),
					}),
				},
			},
		});
		expect(api.settings.profile.get.queryKey()).toEqual(["settings", "profile", "get"]);
	});

	it("paths have a pathKey function that returns the path key", () => {
		const api = createApi({
			auth: {
				users: {
					list: query({
						queryFn: () => ["user1", "user2"],
					}),
				},
			},
		});
		expect(api.auth.users.pathKey()).toEqual(["auth", "users"]);
	});

	it("merges mutation options", () => {
		const api = createApi({
			auth: {
				login: mutation({
					mutationFn: async (vars: { id: number }) => vars,
					gcTime: 100,
				}),
			},
		});
		const res = api.auth.login.mutationOptions({
			gcTime: 200,
		});

		expect(res).toHaveProperty("gcTime", 200);
	});

	it("merges mutation options functions", () => {
		const baseOnSuccess = mock();
		const argumentOnSuccess = mock();

		const api = createApi({
			auth: {
				login: mutation({
					mutationFn: async () => Promise.resolve(null),
					onSuccess: baseOnSuccess,
				}),
			},
		});

		const res = api.auth.login.mutationOptions({
			onSuccess: argumentOnSuccess,
		});

		res.onSuccess?.(null as any, null as any, null as any, null as any);

		expect(baseOnSuccess).toHaveBeenCalled();
		expect(argumentOnSuccess).toHaveBeenCalled();
	});
});
