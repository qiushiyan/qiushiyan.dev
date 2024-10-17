---
title: React Query Patterns
slug: react-query-patterns
date: '2024-10-13'
headings:
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
- title: Separate client and server state
  slug: separate-client-and-server-state
  depth: 2
- title: Data Transformations
  slug: data-transformations
  depth: 2
- title: Error Handling
  slug: error-handling
  depth: 2
- title: Optimistic Updates
  slug: optimistic-updates
  depth: 2
- title: Mutation Callbacks
  slug: mutation-callbacks
  depth: 2
- title: Invalidation After Mutation
  slug: invalidation-after-mutation
  depth: 2
- title: Typed Query Options
  slug: typed-query-options
  depth: 2
- title: Using with Fullstack Frameworks
  slug: using-with-fullstack-frameworks
  depth: 2
- title: With Remix
  slug: with-remix
  depth: 2
- title: With Next.js
  slug: with-nextjs
  depth: 2
---

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
    queryKey: ['todos', state],
    queryFn: () => fetchTodos(state),
    initialData: () => {
      const allTodos = queryClient.getQueryData<Todos>([
        'todos',
        'all',
      ])
      const filteredData =
        allTodos?.filter((todo) => todo.state === state) ?? []

      return filteredData.length > 0 ? filteredData : undefined
    },
  })
```

Another example of pre-filling an id-based query

``` ts
const result = useQuery({
  queryKey: ['todo', todoId],
  queryFn: () => fetch('/todos'),
  initialData: () => {
    // Use a todo from the 'todos' query as the initial data for this todo query
    return queryClient.getQueryData(['todos'])?.find((d) => d.id === todoId)
  },
})
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
  queryKey: ['todo', todoId],
  queryFn: () => fetch(`/todos/${todoId}`),
  initialData: () => {
    // Get the query state
    const state = queryClient.getQueryState(['todos'])

    // If the query exists and has data that is no older than 10 seconds...
    if (state && Date.now() - state.dataUpdatedAt <= 10 * 1000) {
      // return the individual todo
      return state.data.find((d) => d.id === todoId)
    }

    // Otherwise, return undefined and let it fetch from a hard loading state!
  },
})
```

Only set initial data if it’s the first page

``` tsx
const [page, setPage] = React.useState(0)

const { data } = useQuery({
  queryKey: ['todos', page],
  queryFn: () => fetchTodos(page),
  initialData: page === 0 ? initialDataForPageZero : undefined,
  staleTime: 5 * 1000,
})
```

## Seeding with Pushing or Pulling {#seeding-with-pushing-or-pulling}

Setting `initialData` is a form of seeding, this is often used when we
need a query to fetch a list of items as well as queries to fetch
individual items. Here are two common patterns

- **Pulling**: when `initialData` is needed for the single item, search
  the item in the list, if not found, fetch it from the server

``` tsx
 useQuery({
    queryKey: ['todos', 'detail', id],
    queryFn: () => fetchTodo(id),
    // !mark(1:1)
    initialData: () => {
      return queryClient
        .getQueryData(['todos', 'list'])
        ?.find((todo) => todo.id === id)
    },
    // !mark(1:1)
    initialDataUpdatedAt: () =>
      // ⬇️ get the last fetch time of the list
      queryClient.getQueryState(['todos', 'list'])?.dataUpdatedAt,
 })
```

Pulling is the **recommended** approach because it seeds “just in time”,
the only downside is that you need an extra `initialDataUpdatedAt` to
make sure react query respects the stale time.

- **Pushing**: when the list query is resolved, seed each entry to their
  individual queries with `queryClient.setQueryData()`

``` tsx
const useTodos = () => {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: ['todos', 'list'],
    queryFn: async () => {
      const todos = await fetchTodos()
      // !mark(1:3)
      todos.forEach((todo) => {
        queryClient.setQueryData(['todos', 'detail', todo.id], todo)
      })
      return todos
    },
  })
}
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
const queryClient = useQueryClient()
const { data: articleData, isPending } = useQuery({
  queryKey: ['article', id],
  queryFn: (...args) => {

// !mark(1:4)
    queryClient.prefetchQuery({
      queryKey: ['article-comments', id],
      queryFn: getArticleCommentsById,
    })

    return getArticleById(...args)
  },
})
```

If the primary query is a suspense query, you should not put the
prefetch query inside the same component, because that component is
unmounted before the suspense query resolves, and the prefetch query
will only kick off until the suspsense query resolves. You can prefetch
“one level up” in the parent component.

``` tsx
#| caption: Prefech outside the suspense query
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

## Separate client and server state {#separate-client-and-server-state}

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
      enabled: typeof draft === "undefined"
    }
  );

  return {
    value: draft ?? data,
    setDraft,
    queryInfo
  };
};

function Modal({ close }) {
  const {
    value,
    setDraft,
    queryInfo: { isLoading, error }
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
    queryKey: ['todos'],
    queryFn: fetchTodos,
    select,
  })

export const useTodosCount = () =>
  useTodosQuery((data) => data.length)
export const useTodo = (id) =>
  useTodosQuery((data) => data.find((todo) => todo.id === id))
```

A component using the `useTodoCount` custom hook will only re-render if
the length of the `todos` changes. It will not re-render if e.g. the
name of a todo changed.

In contrast to transforming the data directory after `useTodo`, which
runs during every re-render or when the query data changes, the `select`
option is a more efficient way to transform data.

``` tsx
#| caption: An alternative to the `select` option
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

- the `error` property returned from `useQuery`

``` tsx
const { isError } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
})

if (isError) {
    return <ErrorComponent />
}
```

- the `onError` callback (on the query itself or the global QueryCache /
  MutationCache)

``` tsx
const useTodos = () =>
  useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    onError: (error) =>
      toast.error(`Something went wrong: ${error.message}`),
  })
```

- using Error Boundaries

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

**Pattern**: handle refetch errors globally with toast messages and
handle other errors with in-component messages or error boundaries.

``` tsx
#| caption: Handle refectch errors globally with toast messages (check data is undefined)
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // 🎉 only show error toasts if we already have data in the cache
      // which indicates a failed background update
      if (query.state.data !== undefined) {
        toast.error(`Something went wrong: ${error.message}`)
      }
    },
  }),
})
```

## Optimistic Updates {#optimistic-updates}

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
        queryKey: ['todos', 'list']
      })
    },
  })

// in the component

const updateTodo = useUpdateTodo()
updateTodo.mutate(
  { title: 'newTitle' },
  // ✅ only redirect if we're still on the detail page
  // when the mutation finishes
  { onSuccess: () => history.push('/todos') }
)
```

## Invalidation After Mutation {#invalidation-after-mutation}

``` tsx
import { matchQuery } from '@tanstack/react-query'

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          // invalidate all matching tags at once
          // or everything if no meta is provided
          mutation.meta?.invalidates?.some((queryKey) =>
            matchQuery({ queryKey }, query)
          ) ?? true,
      })
    },
  }),
})

// usage:
useMutation({
  mutationFn: updateLabel,
  meta: {
    invalidates: [['issues'], ['labels']],
  },
})
```

``` tsx
declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidates?: Array<QueryKey>
    }
  }
}
```

## Typed Query Options {#typed-query-options}

While the `useQuery` generic is automatically typed by `queryFn`,
methods such as `queryClient.getQueryData({ queryKey })` does not have
access to the query function type. To solve this, we can co-locate the
`queryKey` and `queryFn` using the `queryOptions` helper and use it in
both `useQuery` and `getQueryData`.

``` tsx
import { queryOptions } from '@tanstack/react-query'

const fetchGroups = (): Promise<Group[]> =>
  axios.get('/groups').then((response) => response.data)


function groupOptions() {
  return queryOptions({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    staleTime: 5 * 1000,
  })
}
useQuery(groupOptions())
const data = queryClient.getQueryData(groupOptions().queryKey)
//     ^? const data: Group[] | undefined
```

## Using with Fullstack Frameworks {#using-with-fullstack-frameworks}

## With Remix {#with-remix}

## With Next.js {#with-nextjs}
