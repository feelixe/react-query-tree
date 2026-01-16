# React Query Tree

React Query Tree lets you define your API as a tree of queries and mutations, with fully typed queryKeys and a slim API for accessing them.

**☹️ Traditional method**

- Query keys and path keys are not typed
- No obvious way to structure collections of queries and mutations to is easily accessible.

```ts
const todosQuery = useQuery({
  queryKey: ["todos", "list"],
  queryFn: () => {
    return fetch("https://jsonplaceholder.typicode.com/todos").then((res) =>
      res.json()
    );
  },
});
```

<br />

**🥳 With React Query Tree**

- Single object for accessing all queries and mutations
- Query keys are typed which makes invalidation a breeze

**api.ts**

```ts
export const api = createClient({
  todos: {
    list: query({
      queryFn: async () => {
        return fetch("https://jsonplaceholder.typicode.com/todos").then((res) =>
          res.json()
        );
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

### Collections and client

To avoid making the api object huge you can split it into collections and move to separate files.
