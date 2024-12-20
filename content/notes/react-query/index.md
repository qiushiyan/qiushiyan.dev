---
title: React Query Patterns
slug: react-query-patterns
date: '2024-10-13'
category: Web Development
headings:
- title: Customizing the Defaults
  slug: customizing-the-defaults
  depth: 2
- title: Validating Query Response
  slug: validating-query-response
  depth: 2
- title: Pre-filling with `initialData`
  slug: pre-filling-with-initialdata
  depth: 2
- title: Difference Between `initialData` and `placeholderData`
  slug: difference-between-initialdata-and-placeholderdata
  depth: 3
- title: Conditional `initialData`
  slug: conditional-initialdata
  depth: 3
- title: Seeding with Pushing or Pulling
  slug: seeding-with-pushing-or-pulling
  depth: 2
- title: Prefetching
  slug: prefetching
  depth: 2
- title: Separate Client and Server State
  slug: separate-client-and-server-state
  depth: 2
- title: Data Transformations
  slug: data-transformations
  depth: 2
- title: Error Handling
  slug: error-handling
  depth: 2
- title: Reset Error Boundaries
  slug: reset-error-boundaries
  depth: 3
- title: Suspense Queries
  slug: suspense-queries
  depth: 2
- title: Mutations
  slug: mutations
  depth: 2
- title: Mutation Callbacks
  slug: mutation-callbacks
  depth: 2
- title: Invalidation After Mutation
  slug: invalidation-after-mutation
  depth: 2
- title: Optimistic Updates
  slug: optimistic-updates
  depth: 2
- title: Query and Mutation Cancellation
  slug: query-and-mutation-cancellation
  depth: 2
- title: Typed Query Options
  slug: typed-query-options
  depth: 2
- title: Parallel Queries
  slug: parallel-queries
  depth: 2
- title: Pagination
  slug: pagination
  depth: 2
- title: Infinite Queries
  slug: infinite-queries
  depth: 2
- title: Offline Support with `networkMode`
  slug: offline-support-with-networkmode
  depth: 2
- title: Offline Mutations
  slug: offline-mutations
  depth: 3
- title: Persistence
  slug: persistence
  depth: 2
- title: Using with SSR
  slug: using-with-ssr
  depth: 2
- title: With Next.js
  slug: with-next.js
  depth: 3
- title: With Remix
  slug: with-remix
  depth: 3
---

## Customizing the Defaults {#customizing-the-defaults}

- Global configuration in `new QueryClient()`

``` tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
    },
  },
});
```

- Control a subset of queries with `setQueryDefaults`

``` tsx
// set options for a subset of queries via fuzzy matching on the query keys
queryClient.setQueryDefaults(["todos", "detail"], { staleTime: 1000 });
```

Suppose we have the following keys

    ["todos", "detail1", 1] // match
    ["todos", "detail2", 2] // match
    ["todos", "list"] // not affected

- For a specific query set the options directly in `useQuery`

Additionally, all options in `useQuery` (except for `queryKey`) can have
a default value, even the query function.

``` tsx
queryClient.setQueryDefaults(["todos"], {
  staleTime: 5000,
  queryFn: ({ queryKey }) => fetchTodos(queryKey),
});

// can omit the query function in the following queries
function useTodos() {
  return useQuery({
    queryKey: ["todos"],
  });
}

function useCompletedTodos() {
  return useQuery({
    queryKey: ["todos", "completed"],
    staleTime: 1000,
  });
}
```

## Validating Query Response {#validating-query-response}

``` tsx
useQuery({
  queryKey: ['todos'],
  queryFn: () => {
    const response = await fetch('/todos')
    const data = await response.json()
    // !mark(1:1)
    return TodoSchema.parse(data)
  }
})
```

The benefit of using `zod`

- Saves memory in the cache by stripping un-specified fields

- Throws errors when data doesn’t match

## Pre-filling with `initialData` {#pre-filling-with-initialdata}

We can use `initialData` to pre-fill the query cache in two ways

- pass results from server components to client components to save the
  first fetch

``` tsx
// server.tsx
async function ServerComponent() {
  const data = await getData();
  return <ClientComponent data={data} />;
}

// client.tsx
"use client"
function ClientComponent({ data }) {
  const { data } = useQuery('key', fetcher, { initialData: data });
}
```

- when a query is a subset of another query (e.g., fetching the
  completed todos is a subset of fetching all todos), we can use the
  query data from the parent query to pre-fill the child query,
  [source](https://tkdodo.eu/blog/practical-react-query#treat-the-query-key-like-a-dependency-array)

``` ts
export const useTodosQuery = (state: State) =>
  useQuery({
    queryKey: ["todos", state],
    queryFn: () => fetchTodos(state),
    initialData: () => {
      const allTodos = queryClient.getQueryData<Todos>(["todos", "all"]);
      const filteredData =
        allTodos?.filter((todo) => todo.state === state) ?? [];

      return filteredData.length > 0 ? filteredData : undefined;
    },
  });
```

Another example of pre-filling an id-based query

``` ts
const result = useQuery({
  queryKey: ["todo", todoId],
  queryFn: () => fetch("/todos"),
  initialData: () => {
    // Use a todo from the 'todos' query as the initial data for this todo query
    return queryClient.getQueryData(["todos"])?.find((d) => d.id === todoId);
  },
});
```

### Difference Between `initialData` and `placeholderData` {#difference-between-initialdata-and-placeholderdata}

[source](https://tkdodo.eu/blog/placeholder-and-initial-data-in-react-query#differences)

`initialData` works on cache level, while `placeholderData` works on
observer level.

- caches are identified by query keys, while observers are subscriptions
  created by `useQuery` calls. Example settings that affect the cache
  entry are `queryFn` and `gcTime`, while settings that affect the
  observer are `select` and `refetchInternal`.

- `initialData` is persisted to the cache. `placeholderData` on the
  other hand is never persisted to the cache. I like to see it as
  “fake-it-till-you-make-it” data. It’s “not real”.

- refetch is triggered immediately regardless of presence of
  placeholderData, because it’s not “real”. But, if you provide
  `initialData`, react query will wait after `staleTime` before
  refetching.

### Conditional `initialData` {#conditional-initialdata}

Only set initial data if the data available is updated recently.

``` tsx
const result = useQuery({
  queryKey: ["todo", todoId],
  queryFn: () => fetch(`/todos/${todoId}`),
  initialData: () => {
    // Get the query state
    const state = queryClient.getQueryState(["todos"]);

    // If the query exists and has data that is no older than 10 seconds...
    if (state && Date.now() - state.dataUpdatedAt <= 10 * 1000) {
      // return the individual todo
      return state.data.find((d) => d.id === todoId);
    }

    // Otherwise, return undefined and let it fetch from a hard loading state!
  },
});
```

Only set initial data if it’s the first page

``` tsx
const [page, setPage] = React.useState(0);

const { data } = useQuery({
  queryKey: ["todos", page],
  queryFn: () => fetchTodos(page),
  initialData: page === 0 ? initialDataForPageZero : undefined,
  staleTime: 5 * 1000,
});
```

## Seeding with Pushing or Pulling {#seeding-with-pushing-or-pulling}

Setting `initialData` is a form of seeding, this is often used when we
need a query to fetch a list of items as well as queries to fetch
individual items. Here are two common patterns

- **Pulling**: when `initialData` is needed for the single item, search
  the item in the list, if not found, fetch it from the server

``` tsx
useQuery({
  queryKey: ["todos", "detail", id],
  queryFn: () => fetchTodo(id),
  // !mark(1:1)
  initialData: () => {
    return queryClient
      .getQueryData(["todos", "list"])
      ?.find((todo) => todo.id === id);
  },
  // !mark(1:1)
  initialDataUpdatedAt: () =>
    // ⬇️ get the last fetch time of the list
    queryClient.getQueryState(["todos", "list"])?.dataUpdatedAt,
});
```

Pulling is the **recommended** approach because it seeds “just in time”,
the only downside is that you need an extra `initialDataUpdatedAt` to
make sure react query respects the stale time.

- **Pushing**: when the list query is resolved, seed each entry to their
  individual queries with `queryClient.setQueryData()`

``` tsx
const useTodos = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["todos", "list"],
    queryFn: async () => {
      const todos = await fetchTodos();
      // !mark(1:3)
      todos.forEach((todo) => {
        queryClient.setQueryData(["todos", "detail", todo.id], todo);
      });
      return todos;
    },
  });
};
```

With pushing `staleTime` is automatically respected, because the seed
happens at the same time as the list fetch. But this might create
unnecessary cache entries and the pushed data might be garbage collected
too early.

## Prefetching {#prefetching}

[source](https://tanstack.com/query/latest/docs/framework/react/guides/prefetching)

Seeding is useful when you have the exact data that is needed for future
queries. When working with relational data, e.g. a feed and its
comments, we don’t get the comments when you fetch the feed, but we can
prefetch the comments when we fetch the feed in parallel.

``` tsx
#| caption: Prefetching comments for an article
function Article({ id }) {
  const { data: articleData, isPending } = useQuery({
    queryKey: ['article', id],
    queryFn: getArticleById,
  })

  useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
    // !mark(1:2)
    // Optional optimization to avoid rerenders when this query changes:
    notifyOnChangeProps: [],

    // !mark(1:3)
    // Only prefetch is the data is older than 5 years old, to disable prefetch when there is data, set staleTime: Infinity
    staleTime: 5000
  })

  if (isPending) {
    return 'Loading article...'
  }

  return (
    <>
      <ArticleHeader articleData={articleData} />
      <ArticleBody articleData={articleData} />
      <Comments id={id} />
    </>
  )
}

function Comments({ id }) {
  // this query will be prefetched when the article query is fetched
  const { data, isPending } = useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
  })
}
```

Another way is to prefetch inside of the query function. This makes
sense if you know that every time an article is fetched it’s very likely
comments will also be needed. For this, we’ll use
`queryClient.prefetchQuery`:

``` tsx
const queryClient = useQueryClient();
const { data: articleData, isPending } = useQuery({
  queryKey: ["article", id],
  queryFn: (...args) => {
    // !mark(1:4)
    queryClient.prefetchQuery({
      queryKey: ["article-comments", id],
      queryFn: getArticleCommentsById,
    });

    return getArticleById(...args);
  },
});
```

If the primary query is a suspense query, you should not put the
prefetch query inside the same component, because that component is
unmounted before the suspense query resolves, and the prefetch query
will only kick off until the suspsense query resolves. You can prefetch
“one level up” in the parent component.

``` tsx
#| caption: Prefetch outside the suspense query
function App() {
  // !mark(1:5)
  usePrefetchQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
    notifyOnChangeProps: [],
  })

  return (
    <Suspense fallback="Loading articles...">
      <Articles />
    </Suspense>
  )
}

function Articles() {
  const { data: articles } = useSuspenseQuery({
    queryKey: ['articles'],
    queryFn: (...args) => {
      return getArticles(...args)
    },
  })

  return articles.map((article) => (
    <div key={articleData.id}>
      <ArticleHeader article={article} />
      <ArticleBody article={article} />
    </div>
  ))
}
```

## Separate Client and Server State {#separate-client-and-server-state}

[source](https://tkdodo.eu/blog/practical-react-query#keep-server-and-client-state-separate)

Use a query to pre-fill some user inputs, if the input is not touched,
keep the query running, if the input is touched, stop the query and use
the user input.

In the following example, input is bind to `value` , which can be either
the `draft` state or the query data, as long as the user starts typing
the draft state takes precedence and enabled is will be `false`.

``` tsx
const useRandomValue = () => {
  const [draft, setDraft] = React.useState(undefined);
  const { data, ...queryInfo } = useQuery(
    "random",
    async () => {
      await sleep(1000);
      return Promise.resolve(String(Math.random()));
    },
    {
      enabled: typeof draft === "undefined",
    }
  );

  return {
    value: draft ?? data,
    setDraft,
    queryInfo,
  };
};

function Modal({ close }) {
  const {
    value,
    setDraft,
    queryInfo: { isLoading, error },
  } = useRandomValue();

  return (
    <div>
      {isLoading && "Loading..."}
      {error && "error"}
      {value !== undefined && (
        <input
          type="text"
          value={value}
          onChange={(event) => setDraft(event.target.value)}
        />
      )}
      <span style={{ cursor: "pointer" }} onClick={close}>
        &times;
      </span>
    </div>
  );
}
```

## Data Transformations {#data-transformations}

You can use the `select` option to select a subset of the data that your
component should subscribe to. This is useful for highly optimized data
transformations or to avoid unnecessary re-renders.

``` tsx
export const useTodosQuery = (select) =>
  useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    select,
  });

export const useTodosCount = () => useTodosQuery((data) => data.length);
export const useTodo = (id) =>
  useTodosQuery((data) => data.find((todo) => todo.id === id));
```

A component using the `useTodoCount` custom hook will only re-render if
the length of the `todos` changes. It will not re-render if e.g. the
name of a todo has changed.

In contrast to transforming the data directory after `useTodo`, which
runs during every re-render or when the query data changes, the `select`
option is a more efficient way to transform data.

``` tsx
#| caption: An alternative to the `select` option, that only re-renders if the accessed property is changed
export const useTodosQuery = () => {
  const queryInfo = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos
  })

  return {
    ...queryInfo,
    data: React.useMemo(
      () => queryInfo.data?.length,
      [queryInfo.data]
    ),
  }
}
```

## Error Handling {#error-handling}

- Use the `error` property returned from `useQuery`

``` tsx
const { isError } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
})

if (isError) {
    return <ErrorComponent />
}
```

- Use the `onError` callback (on the query itself or the global
  `QueryCache` / `MutationCache`)

``` tsx
const useTodos = () =>
  useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    onError: (error) => toast.error(`Something went wrong: ${error.message}`),
  });
```

- Use Error Boundaries

Set `throwOnError` to `true` to throw an error when the query fails,
which can be caught by an error boundary.

``` tsx
const todos = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    // !mark(1:1)
    throwOnError: true,
})

// custom error logic
// !mark(1:1)
throwOnError: (error) => error.response?.status >= 500,
```

It’s possible to have more granular control over error handling by
passing a function to `throwOnError` such that only when the function
return `true`, the error will be thrown

``` tsx
useQuery({
  queryKey: ["todos"],
  throwOnError: (error, query) => {
    // only throw if no cache exists
    // fail silently if we have data in the cache
    return query.state.data === undefined;
  },
});

// global configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: (error, query) => {
        return query.state.data === undefined;
      },
    },
  },
});
```

------------------------------------------------------------------------

**Pattern**: handle refetch errors globally with toast messages and
handle initial load errors with error boundaries

``` tsx
#| caption: Throw error if error happens in the initial load, otherwise show a toast message
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // !mark(1:1)
      throwOnError: (error, query) => {
        return typeof query.state.data === "undefined"
      }
    }
  }
  // !mark(1:1)
  queryCache: new QueryCache({
    onError: (error, query) => {
      // 🎉 only show error toasts if we already have data in the cache
      // which indicates a failed background update
      if (typeof query.state.data !== undefined) {
        toast.error(`Something went wrong: ${error.message}`)
      }
    },
  }),
})
```

### Reset Error Boundaries {#reset-error-boundaries}

Query errors can be reset with the `QueryErrorResetBoundary` component
or with the `useQueryErrorResetBoundary` hook.

When using the component it will reset any query errors within the
boundaries of the component:

``` tsx
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

const App = () => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <div>
            There was an error!
            <Button onClick={() => resetErrorBoundary()}>Try again</Button>
          </div>
        )}
      >
        <Page />
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);
```

## Suspense Queries {#suspense-queries}

- there is no `enabled` option for `useSuspenseQuery`, because multiple
  suspense queries run sequentially so the dependency is expressed by
  the order of the queries

- there is no `placeholderData` for suspense queries, but you can
  simulate the same pagination example with the `startTransition` hook.

``` tsx
function App() {
  <Suspense fallback={<div>loading...</div>}>
    <Todos />
  </Suspense>;
}

function Todos() {
  const todos = useSuspenseQuery({
    queryKey: ["todos", page],
    queryFn: () => fetchTodos(page),
  });
  const [isPreviousData, startTransition] = useTransition();

  return (
    <div>
      <ul style={{ opacity: isPreviousData ? 0.5 : 1 }}>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <div>
        <button
          onClick={() => {
            startTransition(() => {
              setPage((prev) => prev - 1);
            });
          }}
        >
          previous
        </button>
        <button
          onClick={() => {
            startTransition(() => {
              setPage((prev) => prev + 1);
            });
          }}
        >
          next
        </button>
      </div>
    </div>
  );
}
```

## Mutations {#mutations}

- `useMutation` is imperative, while `useQuery` is declarative. You need
  to call the returned `mutate` function yourself to trigger the
  mutation.

- `mutationKey` is not required for `useMutation` and has nothing to do
  with query keys. Set it to the same as a query key does not revalidate
  that query, use `queryClient.invalidateQueries` instead.

- When you need to share states of a mutation across components, set
  `mutationKey` and use `useMutationState` to access the state.

``` tsx
function App() {
  const mutation = useMutation({
    mutationKey: ["todos"],
    mutationFn: (newTodo) => {
      return axios.post('/todos', newTodo)
    },
  })

  return (
    <div>
      {mutation.isPending ? (
        'Adding todo...'
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              // !mark(1:1)
              mutation.mutate({ id: new Date(), title: 'Do Laundry' })
            }}
          >
            Create Todo
          </button>
        </>
      )}
    </div>
  )
}

const data = useMutationState(
  filters: { mutationKey: ['todos'] },
  select: (mutation) => mutation.state.data,
)
// !mark(1:2)
// get the latest data from the mutation (data is an array of all data from past mutations)
const latest = data[data.length - 1]
```

## Mutation Callbacks {#mutation-callbacks}

[source](https://tkdodo.eu/blog/mastering-mutations-in-react-query#some-callbacks-might-not-fire)

Callbacks such as `onSuccess`, `onError` and `onSettled` can be set on
`useMutation` as well as on `mutate` itself. One difference is that the
callbacks on `useMutation` fire before the callbacks on `mutate`.
Further, the callbacks on `mutate` might not fire at all if the
component un-mounts before the mutation has finished.

Rule of thumbs to separate concerns between callbacks in `useMutation`
and `mutate`:

- do absolutely necessary logic (such as query invalidation) in
  `useMutation` callbacks

- Do UI related things like redirects or showing toast notifications in
  mutate callbacks. If the user navigated away from the current screen
  before the mutation finished, those will purposefully not fire.

``` tsx
const useUpdateTodo = () =>
  useMutation({
    mutationFn: updateTodo,
    // ✅ always invalidate the todo list
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos", "list"],
      });
    },
  });

// in the component

const updateTodo = useUpdateTodo();
updateTodo.mutate(
  { title: "newTitle" },
  // ✅ only redirect if we're still on the detail page
  // when the mutation finishes
  { onSuccess: () => history.push("/todos") }
);
```

## Invalidation After Mutation {#invalidation-after-mutation}

The simplest form of invalidation is to invalidate a single query after
a mutation.

``` ts
useMutation({
  mutationFn: updateTodo,
  // !mark(1:1)
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["todos", "list"],
    });
  },
});
```

To make things more declarative, we can set a global `onSuccess`
callback on `MutationCache` to search for a `meta` property in the
finished mutation, if a query matches the meta property, invalidate it.

``` tsx
import { matchQuery } from "@tanstack/react-query";

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      queryClient.invalidateQueries({
        queryKey,
        predicate: (query) =>
          // invalidate all matching tags at once
          // or everything if no meta is provided
          mutation.meta?.invalidates?.some((queryKey) =>
            matchQuery({ queryKey }, query)
          ) ?? true,
      });
    },
  }),
});

// usage:
useMutation({
  mutationFn: mutateFn,
  meta: {
    invalidates: [["issues"], ["labels"]],
  },
});
```

``` tsx
declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidates?: Array<QueryKey>;
    };
  }
}
```

## Optimistic Updates {#optimistic-updates}

[source](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)

Optimistic updates can be implemented in 2 ways

- after `mutationFn` is called, display `variables` (the input supplied
  to `mutationFn`) from `useMutation` or `useMutationState`, this is
  directly manipulating the UI

``` tsx
const addTodoMutation = useMutation({
  mutationFn: (newTodo: string) => axios.post('/api/data', { text: newTodo }),
  // make sure to _return_ the Promise from the query invalidation
  // so that the mutation stays in `pending` state until the refetch is finished
  onSettled: async () => {
    // !mark(1:1)
    return await queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})

const { isPending, submittedAt, variables } = addTodoMutation

return <ul>
  {todoQuery.items.map((todo) => (
    <li key={todo.id}>{todo.text}</li>
  ))}
  {isPending && <li style={{ opacity: 0.5 }} key={submittedAt}>{variables}</li>}
</ul>
```

Because we are awaiting `invalidateQueries`, `isPending` will only be
`false` when the invalidation is finished. So when the opacity item is
removed, we will see the most up-to-date data.

This approach can be problematic we if you click on multiple checkboxes
in a row, there is a going to be a gap between the several
`invalidateQueries`. For example, if the second todo we clicked on is
originally checked, it is now unchecked, if the first invalidation
finishes now, it will try to update the second todo to be checked again,
because that’s what the server state is now. It will fix itself after
the last mutation has succeeded and the queries have been invalidated,
but it’s not a great experience for the user.

The root of this problem is that we are only not changing the cache
until the mutation is finished. We can fix this by updating the cache
immediately after the mutation is called, and then revert the cache if
the mutation fails.

- Second method: use the `onMutate` callback to manipulate the cache,
  the gist is that we `setQueryData` with the new data, and if the
  mutation fails, we revert the cache to the previous state. The value
  returned by `onMutate` can be accessed via the `context` argument in
  `onError` and `onSettled`.

``` tsx
const queryClient = useQueryClient();

useMutation({
  mutationFn: updateTodo,
  // When mutate is called:
  onMutate: async (newTodo) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({ queryKey: ["todos"] });

    // Snapshot the previous value
    const previousTodos = queryClient.getQueryData(["todos"]);

    // Optimistically update to the new value
    queryClient.setQueryData(["todos"], (old) => [...old, newTodo]);

    // Return a context object with the snapshotted value

    // !mark(1:1)
    return { previousTodos };
  },
  // If the mutation fails,
  // use the context returned from onMutate to roll back
  onError: (err, newTodo, context) => {
    // !mark(1:1)
    queryClient.setQueryData(["todos"], context.previousTodos);
  },
  // Always refetch after error or success:
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
```

You can also return a function from `onMutate` to serve as a rollback

``` tsx
useMutation({
  onMutate: () => {
    // ... do the optimistic update
    const snapshot = queryClient.getQueryData(["todos"]);
    // !mark(1:3)
    return () => {
      queryClient.setQueryData(["todos"], snapshot);
    };
  },
  onError: (error, variables, rollback) => {
    // !mark(1:1)
    rollback?.();
  },
});
```

## Query and Mutation Cancellation {#query-and-mutation-cancellation}

Queries can be canceled manually with
`queryClient.cancelQueries({queryKey})`.

As an alternative, if your `queryFn` understands the signal from
`AbortController`, `queryFn` are given a `signal` parameter, which comes
from an `AbortController` object react query creates under the hood.
Imagine you are making queries based on a search input, it is helpful to
cancel previous queries except for the latest one.

``` ts
useQuery({
  queryKey: ["todos", search],
  queryFn: async ({ signal }) => {
    // !callout[/signal/] using the signal from queryContext to cancel ongoing requests
    const response = await fetch(`/todos?search=${search}`, { signal });
    return response.json();
  },
});
```

Cancellation **does not** work when working with Suspense hooks:
`useSuspenseQuery`, `useSuspenseQueries` and `useSuspenseInfiniteQuery`.

## Typed Query Options {#typed-query-options}

While the `useQuery` generic is automatically typed by `queryFn`,
methods such as `queryClient.getQueryData({ queryKey })` does not have
access to the query function type. To solve this, we can co-locate the
`queryKey` and `queryFn` using the `queryOptions` helper and use it in
both `useQuery` and `getQueryData`.

``` tsx
import { queryOptions } from "@tanstack/react-query";

const fetchGroups = (): Promise<Group[]> =>
  axios.get("/groups").then((response) => response.data);

function groupOptions() {
  return queryOptions({
    queryKey: ["groups"],
    queryFn: fetchGroups,
    staleTime: 5 * 1000,
  });
}
useQuery(groupOptions());
const data = queryClient.getQueryData(groupOptions().queryKey);
//     ^? const data: Group[] | undefined
```

## Parallel Queries {#parallel-queries}

Multiple `useQuery` observers are already running in parallel by
default.

``` tsx
#| caption: two queries running in parallel
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})

useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
})
```

But there are cases where the queries are dynamic and can’t be laid out
statically. In such cases, we can use `useQueries` to dynamically
generate multiple query options object:

``` tsx
function App({ users }) {
  const userQueries = useQueries({
    queries: users.map((user) => {
      return {
        queryKey: ["user", user.id],
        queryFn: () => fetchUserById(user.id),
      };
    }),
  });
}
```

The return value of `useQueries` is an array of individual `useQuery`
results, and you can process the array however you want.

``` tsx
const areAnyPending = userQueries.some((query) => query.status === "pending");
```

If `queries` in `useQueries` is an empty array, it won’t do anything.
This is useful to implement dependent queries similar to the `enabled`
option.

In the following example, we fetch a list of repos and then fetch the
issues for each repo. We use `useQueries` to dynamically generate the
issue queries.

``` tsx
function useRepos() {
  return useQuery({
    queryKey: ['repos'],
    queryFn: fetchRepos
  })
}

function useIssues(repos) {
  return useQueries({
    queries: repos?.map((repo) => ({
      queryKey: ['repos', repo.name, 'issues'],
      queryFn: async () => {
        const issues = await fetchIssues(repo.name)
        // !mark(1:1) return the repo name along with the issues
        return { repo: repo.name, issues }
      }
    })) ?? []
  })
}

// component.tsx
function App() {
   const repos = useRepos()
   const issues = useIssues(repos.data)

   return {
    repos.isSuccess ?
      <ul>
        {repos.data.map((repo) => {
          // !mark(1:3) find the issue query for the repo
          const repoIssues = issues.find(
            query => query.data?.repo === repo.name
          )

          const length = repoIssues?.data.issues.length

          return (
            <li key={repo.id}>
              {repo.name}
              {repoIssues
                ? ` (${length === 30 ? "30+" : length} issues)`
                : null
              }
            </li>
          )
        })}
      </ul>
    : null}
}
```

An alternative to dynamic `useQueries` is creating a separate component
for each item and use `useQuery` inside it. A downside of this approach
is that it’s hard to derive values based on all the queries, e.g. to get
the total number of issues. If we are using `useQueries`, we can just
loop through the queries array.

``` ts
const repos = useRepos();
const issues = useIssues(repos.data);

const totalIssues = issues
  .map(({ data }) => data?.issues.length ?? 0)
  .reduce((a, b) => a + b, 0);
```

`useQueries` provides a `combine` argument for this use case, what is
returned from `combine` will be the result of the `useQueries` hook.

``` tsx
function useIssues(repos) {
  return useQueries({
    queries:
      repos?.map((repo) => ({
        queryKey: ["repos", repo.name, "issues"],
        queryFn: async () => {
          const issues = await fetchIssues(repo.name);
          return { repo: repo.name, issues };
        },
      })) ?? [],
    // !mark(1:4)
    combine: (issues) => {
      const totalIssues = issues
        .map(({ data }) => data?.issues.length ?? 0)
        .reduce((a, b) => a + b, 0);

      return { issues, totalIssues };
    },
  });
}

// !mark(1:1)
const { issues, totalIssues } = useIssues(repos.data);
```

`combine` is useful even when you don’t need to derive an aggregation.
You can simply use it to reshape the return values so it fits your
component’s needs.

``` tsx
function useRepoAndIssues({ name }) {
  return useQueries({
    queries: [
      {
        queryKey: ["repos", name],
        queryFn: async () => fetchRepo(name),
      },
      {
        queryKey: ["repos", name, "issues"],
        queryFn: async () => fetchIssues(name),
      },
    ],
    combine: (results) => {
      const isPending = results.some((query) => query.status === "pending");
      const isError = results.some((query) => query.status === "error");

      return {
        repo: results[0].data,
        issues: results[1].data,
        isPending,
        isError,
      };
    },
  });
}
// !mark(1:1)
const { repo, issues, isPending, isError } = useRepoAndIssues({ name });
```

## Pagination {#pagination}

- use `placeholderData: keepPreviousData` to prevent loading spinners
  when the page changes

- use `isPlaceholderData` to provide loading feedback and disable
  pagination buttons

- set up an `useEffect` to prefetch the data for the next page whenever
  page changes

``` tsx
function useRepos(sort, page) {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    // !mark(1:1)
    queryClient.prefetchQuery(getReposQueryOptions(sort, page + 1));
  }, [sort, page, queryClient]);

  return useQuery({
    ...getReposQueryOptions(sort, page),
    // !mark(1:1)
    placeholderData: (previousData) => previousData,
  });
}

function RepoList({ sort, page, setPage }) {
  const { data, status, isPlaceholderData } = useRepos(sort, page);

  if (status === "pending") {
    return <div>...</div>;
  }

  if (status === "error") {
    return <div>There was an error fetching the repos.</div>;
  }

  return (
    <div>
      // !mark(1:1)
      <ul style={{ opacity: isPlaceholderData ? 0.5 : 1 }}>
        {data.map((repo) => (
          <li key={repo.id}>{repo.full_name}</li>
        ))}
      </ul>
      <div>
        <button
          onClick={() => setPage((p) => p - 1)}
          // !mark(1:1)
          disabled={isPlaceholderData || page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          // !mark(1:1)
          disabled={isPlaceholderData || data?.length < PAGE_SIZE}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

## Infinite Queries {#infinite-queries}

`getProjects` is a mock api that returns an object

``` ts
// nextId and previousId are cursors to fetch the next and previous page
{
  data, nextId, previousId;
}
```

Example:

``` tsx
import { useEffect } from "react";
import { useProjects } from "lib/features/project/queries";

const fetchProjects = async (cursor: number) => {
  await delay(1000);
  return await getProjects(cursor);
};

export default function Infinite() {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: projectKeys.list(),
      queryFn: ({ pageParam }) => fetchProjects(pageParam),
      // !mark(1:2)
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextId,
      getPreviousPageParam: (firstPage) => firstPage.previousId,
    });

  const shouldFetch = !isFetchingNextPage && hasNextPage;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // !mark(1:2)
      if (entries.some((entry) => entry.isIntersecting) && shouldFetch) {
        fetchNextPage();
      }
    });

    const trigger = document.getElementById("fetch-trigger");
    if (trigger) {
      observer.observe(trigger);
    }

    return () => {
      if (trigger) {
        observer.unobserve(trigger);
      }
    };
  }, [fetchNextPage, isFetchingNextPage, shouldFetch]);

  return (
    <div>
      {isLoading ? <div>Loading initial data</div> : null}
      {data?.pages
        // !mark(1:1)
        .flatMap((p) => p.data)
        .map((project) => (
          <div
            key={project.id}
            className="flex h-[50vh] items-center justify-center border"
          >
            <h2>{project.name}</h2>
          </div>
        ))}
      // !mark(1:1)
      <div id="fetch-trigger" />
      {isFetchingNextPage ? <div>Loading next page...</div> : null}
      {data && !hasNextPage ? <div>No more projects to load</div> : null}
    </div>
  );
}
```

- Infinite queries are about changing a cursor and provide it to the
  fetch function. `useInfiniteQuery` returns `data` as an 2D array of
  all pages

``` ts
[
  [1, 2, 3], // data for page 1
  [4, 5, 6], // data for page 2
  [7, 8, 9], // data for page 3
];
```

- set `initialPageParam` to give the fetcher a starting point, and use
  `getNextPageParam` to provide the next cursor. How you get the next
  cursor depends, but you get access to the all the current data in the
  `getNextPageParam` function.

- `fetchNextPage` triggers the fetcher with the next cursor, when you
  call `fetchNextPage` is up to you, e.g., using a interaction observer

- if `getNextPageParam` returns undefined or null. `hasNextPage` will be
  set to false and you can conditionally hide the trigger

- infinite queries can be bidrectional (e.g. chat messages),
  `getPreviousPageParam` can be used to fetch the previous page. If the
  API does return a cursor, e.g., it’s built for pagination, we can
  create cursor ourselves

``` tsx
return useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages, lastPageParam) => {
    if (lastPage.length === 0) {
      return undefined
    }
    return lastPageParam + 1
  },
  // !mark(1:2)
  // firstPage is the current topmost page data
  getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
  if (firstPageParam <= 1) {
      return undefined
    }
    return firstPageParam - 1
  },
})
```

- we use a single query key for all pages, this means that all pages are
  treated as a single cache entry and will be revalidated altogether.
  This can become a problem

  - the cache entry can become very large

  - when the query becomes stale and needs to be refetched, each group
    is fetched **sequentially**, starting from the first one. This is
    the only way to ensure we have the most up-to-date data for all
    pages.

Set `maxPages` to limit the amount of pages that are kept in the cache.

``` ts
useInfiniteQuery({
  queryKey: ["projects"],
  queryFn: fetchProjects,
  initialPageParam: 0,
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor,
  // !mark(1:2)
  // only allow 5 pages to be kept in the cache
  maxPages: 5,
});
```

## Offline Support with `networkMode` {#offline-support-with-networkmode}

Both `useQuery` and `useMutation` have a `networkMode` option that has 3
values

- `networkMode = 'online'`: the **default** mode. This means that the
  query and mutation rely on the network to do stuff. If we go offline,
  the query and mutation goes into paused state automatically. A related
  note of this is that you should not use the `isLoading` (and should
  use `isPending`) to show a loading spinner, because `isLoading=false`
  when the query is paused.

``` tsx
const { status, fetchStatus } = useProjects()
// isLoading is derived from status and fetchStatus
const isLoading = status === 'pending' || fetchStatus === 'fetching'

// isLoading will be false when fetchStatus is 'paused'
if (isLoading) {
  return <div>Loading...</div>
}
```

- `networkMode = 'always'`: this mode means that your queries and
  mutations does not need network and access.

  ``` ts
  useQuery({
    queryKey: ["todos"],
    queryFn: () => Promise.resolve([{ id: 1, text: "Do Laundry" }]),
    networkMode: "always",
  });
  ```

  - Queries will never be paused because you have no network connection.

  - Retries will also not pause - your Query will go to error state if
    it fails.

  - `refetchOnReconnect` defaults to `false` in this mode, because
    reconnecting to the network is not a good indicator anymore that
    stale queries should be refetched. You can still turn it on if you
    want.

- `networkMode = 'offlineFirst'`: the first request will always be made
  (possibly without network connection), and if that fails, retries will
  be paused. This mode is useful if you’re using an additional caching
  layer like the browser cache on top of React Query. For example, the
  Github API sets the browser cache as

<!-- -->

    cache-control: public, max-age=60, s-maxage=60

which means that for the next 60 seconds, if you request that resource
again, the response will come from the browser cache.

In this case, we would want to activate react query even if we are
offline, because chances are that the browser cache has the data we
need. And if you have a cache miss, you’ll likely get a network error,
after which React Query will pause the retries, which will put your
query into the paused state. It’s the best of both worlds.

### Offline Mutations {#offline-mutations}

All things mentioned around `networkMode` apply to mutation equally. One
additional thing to note is that we often invalidate the cache in the
`onSettled` callback of a mutation.

``` tsx
useMutation({
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
```

When we go offline in the middle of a mutation, the mutation is paused,
and `onSettled` will be invoked after we go back online again and the
mutation is finished. In contrast, `onMutate` fires before the mutation
function so that our optimistic updates in there can be seen regardless
of the network status.

One problem is, if we have multiple ongoing mutations that are brought
back after we go online. We will be running multiple invalidations,
which might cause the UI to update multiple times. To avoid this, we can
check of the number of ongoing mutations and only invalidate the cache
if it’s the last one.

``` tsx
{
  onSettled;
  () => {
    if (queryClient.isMutating({ mutationKey: ["todos"] }) === 1) {
      return queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  };
}
```

## Persistence {#persistence}

``` tsx
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import {
  defaultShouldDehydrateMutation,
  defaultShouldDehydrateQuery,
  QueryClient,
  useIsRestoring,
} from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
  removeOldestQuery,
} from "@tanstack/react-query-persist-client";

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  // !mark(1:1)
  retry: removeOldestQuery,
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // !mark(1:1)
      gcTime: 1000 * 60 * 60,
    },
  },
});

// !mark(1:1)
queryClient.setMutationDefaults(["posts", "add"], {
  mutationFn: addPost,
});

function App() {
  const isRestoring = useIsRestoring();
  if (isRestoring) {
    return <div>Restoring...</div>;
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        // !mark(1:1)
        maxAge: 1000 * 60 * 60,
        dehydrateOptions: {
          // !callout[/defaultShouldDehydrateQuery/] selectively dehydrate queries
          shouldDehydrateQuery: (query) =>
            defaultShouldDehydrateQuery(query) && query.meta?.persist === true,
          shouldDehydrateMutation: (mutation) =>
            defaultShouldDehydrateMutation(mutation) &&
            mutation.meta?.persist === true,
        },
        // !callout[/onSuccess/] resume mutations
        onSuccess: () => {
          return queryClient.resumePausedMutations();
        },
      }}
    ></PersistQueryClientProvider>
  );
}

// later in components
useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  // !mark(1:1)
  meta: { persist: true },
});
```

Notes for the code above:

- `defaultShouldDehydrateQuery` is a helper function that only persists
  successful queries and respects other react query’s default persist
  logic, the same as `defaultShouldDehydrateMutation`

- set `gcTime` as equal or greater than `maxAge` to avoid queries being
  garbage collected and removed from the storage too early

- mutations and their input can be saved to storage as well, we also set
  the default mutation function for the mutation key so that when
  restoring mutations by key, react query doesn’t need a look up for the
  mutation function

As an experimental feature, we can now set `persist` per query

``` tsx
import { experimental_createPersister } from "@tanstack/react-query-persist-client";

useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  // !mark(1:3)
  persister: experimental_createPersister({
    storage: localStorage,
    // ..other options
  }),
});
```

The default options for the persister are

``` ts
{
  prefix = 'tanstack-query',
  maxAge = 1000 * 60 * 60 * 24,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}
```

## Using with SSR {#using-with-ssr}

https://tanstack.com/query/latest/docs/framework/react/guides/ssr

An example of RSC streaming and prefetching data on the server (don’t
await the prefetch)

``` tsx
export default async function Home() {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: {
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) && query.state.status === "pending",
      }
    }
  })

  queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    staleTime: 1000 * 10
  })

  return <main>
    <header />
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>loading...</div>}>
        <Todos />
      </Suspense>
    </HydrationBoundary>
  </main>
}

function Todos() {
  const todos = useSuspenseQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    staleTime: 1000 * 10
  })

  return ...
}
```

### With Next.js {#with-next.js}

### With Remix {#with-remix}
