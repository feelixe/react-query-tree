# React Query Tree

React Query Tree lets you define your API as a tree of queries and mutations, with fully typed queryKeys and a slim API for accessing them.

> React Query Tree is heavily inspired by the tRPC React Query client. It provides the same type-safe, hierarchical developer experience, but is designed for client-side use cases where a tRPC server is not required.

<br />

**☹️ Traditional method**

- Query keys and path keys are not typed
- No obvious way to organize collections of queries and mutations that is structured and accessible.

```ts
const todosQuery = useQuery({
  queryKey: ["todos", "list"],
  queryFn: () => {
    return fetch("/todos");
  },
});
```

<br />

**🥳 With React Query Tree**

- Single object for accessing all queries and mutations
- Query keys are typed which makes invalidation a breeze

**api.ts**

```ts
import { createApi, query } from "react-query-tree";

export const api = createApi({
  todos: {
    list: query({
      queryFn: () => {
        return fetch("/todos");
      },
    }),
  },
});
```

**component.tsx**

```ts
const todosQuery = useQuery(api.todos.list.queryOptions());
```

## API Documentation

### Nested APIs

To avoid making the API object huge you can split it into smaller chunks that are then used the main API object.

```ts
import { createApi, query } from "react-query-tree";

const todosApi = createApi({
  list: query({
    queryFn: () => {
      return fetch("/todos");
    },
  }),
});

const usersApi = createApi({
  list: query({
    queryFn: () => {
      return fetch("/users");
    },
  }),
});

export const api = createApi({
  todos: todosApi,
  users: usersApi,
});
```

### Invalidation

Invalidating a query.

```ts
queryClient.invalidateQueries({ queryKey: api.todos.list.queryKey() });
```

Invalidating a path (all nested queries inside that object).

```ts
queryClient.invalidateQueries({ queryKey: api.todos.pathKey() });
```

Invalidating inside an API.

```ts
const todosApi = createApi({
  list: query({
    queryFn: () => {
      return fetch("/todos").then((res) => res.json());
    },
  }),
  create: mutation({
    mutationFn: (todo) => {
      return fetch("/todos", {
        method: "POST",
        body: JSON.stringify(todo),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: api.todos.pathKey() });
    },
  }),
});
```

### Query and Mutation options

You can add query and mutation option directly inside your API.

```ts
const todosApi = createApi({
  list: query({
    queryFn: () => {
      return fetch("/todos").then((res) => res.json());
    },
    staleTime: 10_000,
    retry: false,
  }),
});
```

These can be extended when consuming the API.

```ts
useQuery(
  todosApi.list.queryOptions({
    staleTime: 5_000,
  })
);
```

- Primitive values will override the base options.
- Functions such as `onSuccess` will be merged.
