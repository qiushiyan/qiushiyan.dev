---
title: Lessons Learned from "Advanced React"
slug: advanced-react-notes
date: '2024-10-11'
category: Web Development
headings:
- title: Diffing, Reconciliation and Children as Props
  slug: diffing-reconciliation-and-children-as-props
  depth: 2
- title: Force Un-mounting
  slug: force-un-mounting
  depth: 2
- title: Keys
  slug: keys
  depth: 2
- title: The Problem of index-based `key`
  slug: the-problem-of-index-based-key
  depth: 3
- title: Split providers to improve context performance
  slug: split-providers-to-improve-context-performance
  depth: 2
- title: An Alternative to Spliting Providers with HOC
  slug: an-alternative-to-spliting-providers-with-hoc
  depth: 3
- title: Maintaining Stateful Closures with Ref
  slug: maintaining-stateful-closures-with-ref
  depth: 2
- title: Implement debouncing
  slug: implement-debouncing
  depth: 2
- title: '`useLayoutEffect`'
  slug: uselayouteffect
  depth: 2
- title: React Portal
  slug: react-portal
  depth: 2
- title: Data Fetching in `useEffect` with Race Conditions
  slug: data-fetching-in-useeffect-with-race-conditions
  depth: 2
---

You can purchased the book at [Advanced
React](https://www.advanced-react.com/#author) and I highly recommend it
to anyone who is interested in react performance. The book goes deep
into the underlying workings of React yet remains very approachable.

## Diffing, Reconciliation and Children as Props {#diffing-reconciliation-and-children-as-props}

With the following JSX

``` tsx
const Component = () => {
    return (
        <div>
            <Input placeholder="Text1" id="1" />
            <Input placeholder="Text2" id="2" />
        </div>
    );
};
```

The underlying representation is

``` tsx
{
    type: 'div',
    props: {
    children: [
            {
                type: Input,
                props: { id: "1", placeholder: "Text1" }
            },
            {
                type: Input,
                props: { id: "2", placeholder: "Text2" }
            }
        ]
    }
}
```

When this component needs to re-render, react compares the object from
“before” and “after” the state update, if an entry is the same (by
reference) before and after the update, it won’t re-render. If an entry
changes, there are some variations

- if the `type` is the same and the props changes, the `Input` component
  will be marked as “needs update,” and its re-render will be triggered.

- If the `type` has changed, then React, during the re-render cycle,
  will remove (unmount) the “previous” component and add (mount) the
  “next” component.

Let’s say we have a different component that does conditional rendering

``` tsx
const Component = () => {
    if (isCompany) return <Input />;
    return <TextPlaceholder />;
};
```

then, assuming that the update was triggered by `isCompany` value
flipping from true to false, the objects that React will be comparing
are:

``` tsx
// Before update, isCompany was "true"
{
    type: Input,
    ...
}

// After update, isCompany is "false"
{
    type: TextPlaceholder,
    ...
}
```

`type` has changed from Input to `TextPlaceholder` references, so React
will unmount `Input` and remove everything associated with it from the
DOM. And it will mount the new `TextPlaceholder` component and append it
to the DOM for the first time.

This diffing mechanism explains several things

- When the parent needs to re-render, a child component also needs to
  re-render (assuming no memoization) even if it does not need the
  state, with the following component

``` tsx
const Parent = (props) => {
    const [state, setState] = useState();
    return <Child />;
};
```

While `Child` does not touch the state, `<Child />` is just a syntax
sugar for creating the object

``` tsx
{ type: Child, props: [] }
```

and objects are compared by reference, so in React’s world, the two
objects before and after render are always different and `Child` needs
to re-render.

- However, if an entry is created outside of a rendering cycle of
  `Parent`, then the re-rendering of `Parent` does not recreate the
  entry’s jsx object, and React will not re-render that entry. This is
  often the case with children props

``` tsx
const Parent = ({ child }) => {
    const [state, setState] = useState();
    return child;
};

<Parent child={<Child />} />;
```

Now the jsx object for `Child` is created outside of the parent,
`Parent` simply passes down the object reference, so it remains the same
inside the `Parent` rendering cycle.

Similar render props and `children` props won’t re-render if it does not
rely on the parent state. Remember, children nesting are just sytnax
sugar for an explicit `children` prop.

``` tsx
<Parent>
    <Child />
</Parent>

// the same as:
<Parent children={<Child />} />
```

- Nest component definitions is harmful because functions are also
  compared by reference. If you define a child component directly inside
  the parent, that child component will be seen as a different `type` on
  every render and go through unmount-remount everytime.

``` tsx
const Component = () => {
    const Input = () => <input />;
    return <Input />;
};
```

The component returns

``` ts
{
    type: Input,
    // a different function reference every render, so Input is a different component that needs to be remounted everytime
}
```

## Force Un-mounting {#force-un-mounting}

As mentioned before, react uses `type` to determine if a component at
the particular position in the tree can be reused.

Consider the following example

``` tsx
const Form = () => {
const [isCompany, setIsCompany] = useState(false);
    return (
        <>
            {/*checkbox somewhere here*/}
            {isCompany ? (
                <Input id="company-tax-id-number" />
            ) : (
                <Input id="person-tax-id-number" />
            )}
        </>
    )
}
```

If we toggle `isCompany` from `false` to `true`, react will compare the
following tree

<div class="two-column">

<div class="col-span-1">

Before

``` ts
[
    {
        type: Checkbox,
    },
    {
        type: Input,
        props: {
            id: "company-tax-id-number"
        }
    },
];
```

</div>

<div class="col-span-1">

After

``` ts
[
    {
        type: Checkbox,
    },
    {
        type: Input,
        props: {
            id: "person-tax-id-number"
        }
    },
];
```

</div>

</div>

`Checkbox` is re-rendered as usual. The critical piece is that the
element `Input` is considered a component that simply needs a prop
update, because `type` refers to the function component. As a result, if
the input already contains certain HTML state, such as an existing
input, it will be persisted after we toggle the state, because react
only updates the prop without un-mounting. This is not necessarily bad
but something to consider when designing the UX.

If we do want to re-mount `Input` after toggling, we could consider
changing the JSX structure

``` tsx
const Form = () => {
    const [isCompany, setIsCompany] = useState(false);
    return (
        <>
            <Checkbox onChange={() => setIsCompany(!isCompany)} />
            {isCompany ? <Input id="company-tax-id-number" /> : null}
            {!isCompany ? <Input id="person-tax-id-number" /> : null}
        </>
    )
}
```

Before, `isCompany` is `false`:

``` ts
[{ type: Checkbox }, null, { type: Input }]
```

After, `isCompany` is `true`:

``` ts
[{ type: Checkbox }, { type: Input }, null];
```

Here, react will decide to mount `Input` for the second item, and
unmount `Input` for the third item.

This technique can be used reversely. With the same JSX structure, what
if we indeed want to keep the state and reused the same input, we can
just use the same key:

``` tsx
{isCompany ? <Input id="company-tax-id-number" key="text-input" /> : null }
{!isCompany ? <Input id="person-tax-id-number" key="text-input" /> : null }
```

Before

``` ts
[{ type: Input, key: "text-input" }, null]
```

After

``` ts
[null, { type: Input, key: "text-input" }]
```

React sees an array of children and sees that before and after
re-renders, there is an element with the Input type and the same “key.”
So it will think that the Input component just changed its position in
the array and will re-use the already created instance for it.

## Keys {#keys}

There is an alternative way to force mounting by using the `key`
attribute.

So, the root of our problem is that react uses `type` to distinguish
components, if an element has a `key` attribute, it will be used as an
additional identifier: an element will be considered to be of the same
sort if it has the same `type` and `key` before and after render. To
solve our problem using `key`:

``` tsx
{isCompany ?
    <Input id="company-tax-id-number" key="company" /> :
    <Input id="person-tax-id-number" key="person" />
}
```

Before

``` ts
{ type: Input, key: "company" }
```

After

``` ts
{ type: Input, key: "person" }
```

They are now considered different components.

### The Problem of index-based `key` {#the-problem-of-index-based-key}

When rendering a static list, it’s usually fine to use the array index
as `key`. But, if the list item can be reordered, index-based keys will
be problematic, consider the following example:

``` tsx
const data = ['1', '2'];

const Component = () => {
    return data.map((value) => <Input key={value} />);
};
```

The tree is

``` ts
[
    { type: Input, key: 0 }, // "1" data item
    { type: Input, key: 1 }, // "2" data item
];
```

If you reorder the two `Input`, the tree becomes

``` ts
[
    { type: Input, key: 0 }, // "2" data item
    { type: Input, key: 1 }, // "1" data item
];
```

Since the keys are index-based, they don’t change after the reorder.

While we know that the two items are swapped, react sees the same `type`
and `key` and will reuse state. So if you type something in the first
input and then swap, the text still exist in the first input (by
position).

This won’t happen if we are using a real id that uniquely identifies the
input.

Before

``` ts
[
    { type: Input, key: "real id 1" }, // "1" data item
    { type: Input, key: "real id 2" }, // "2" data item
];
```

After

``` ts
[
    { type: Input, key: "real id 2" }, // "2" data item
    { type: Input, key: "real id 1" }, // "1" data item
];
```

Key is no longer the same for both positions. So react will bring the
existing state to the correct `Input` and swap the two DOM nodes.

## Split providers to improve context performance {#split-providers-to-improve-context-performance}

A typical setup with React context is

``` typescript
const NavigationController = ({ children }) => {
    const [isNavExpanded, setIsNavExpanded] = useState();
    const toggle = () => setIsNavExpanded(!isNavExpanded);
    const value = { isNavExpanded, toggle };
    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};
const useNavigation = () => useContext(Context);
```

The problem with this is that as long as the state `isNavExpanded` is
updated, the `value` object is also created as a new object, thus
triggering a re-render from the downstream components, even if it only
needs access to the `setIsNavExpanded` action.

This also has the problem that if the parent of `NavigationController`
re-renders often, any child of `NavigationControler` will also have to
re-render, e.g:

``` typescript
const Layout = ({ children }) => {
    const [scroll, setScroll] = useState();

    useEffect(() => {
        window.addEventListener('scroll', () => {
        setScroll(window.scrollY);
    });
    }, []);

    return (
        <NavigationController>
            <div className="layout">{children}</div>
        </NavigationController>
    )
};
```

`Layout` re-renders on every scroll, triggering a re-render of
`NavigationController`, it recreates the `value` object, thus any
subscriber to it will re-render.

Memoization can help solve problem 2 but not problem 1. Consider the
following changes

``` typescript
const toggle = useCallback(() => {
    setIsNavExpanded(val => !val);
}, []);

const value = useMemo(() => {
    return { isNavExpanded, toggle };
}, [isNavExpanded, toggle]);

return (
    <Context.Provider value={value}>
        {children}
    </Context.Provider>
)
```

With a memoized `value`, context subscribers won’t re-render if `Layout`
updates, but the state `isNavExpanded` and the action `toggle` is still
coupled together such that even if a component only needs the action, it
still re-renders when the state changes.

Solution: two providers

``` tsx
type State = { isNavExpanded: boolean };
const defaultState: State = { isNavExpanded: false };
// store the state here
const ContextData = React.createContext(defaultState);
// store the open/close functions here
const ContextApi = React.createContext({
    open: () => {},
    close: () => {},
    toggle: () => {}
});

type Action = { type: 'open-sidebar' | 'close-sidebar' | 'toggle-sidebar' };
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'open-sidebar':
      return { ...state, isNavExpanded: true };
    case 'close-sidebar':
      return { ...state, isNavExpanded: false };
    case 'toggle-sidebar':
      // we'll have access to the old value here - it's our "state"
      // so just flip it around
      return { ...state, isNavExpanded: !state.isNavExpanded };
  }

  return state;
};

const NavigationController = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  // that one has a dependency on state
  const data = useMemo(() => ({ isNavExpanded: state.isNavExpanded }), [state]);

  // that one never changes - no dependencies
  const api = useMemo(() => {
    return {
      open: () => dispatch({ type: 'open-sidebar' }),
      close: () => dispatch({ type: 'close-sidebar' }),
      toggle: () => dispatch({ type: 'toggle-sidebar' }),
    };
    // don't depend on the state directly anymore!
  }, []);

  return (
    <ContextData.Provider value={data}>
      <ContextApi.Provider value={api}>{children}</ContextApi.Provider>
    </ContextData.Provider>
  );
};

const useNavigationData = () => useContext(ContextData);
const useNavigationApi = () => useContext(ContextApi);
```

This way the actions do not depend on the state, and two `useContext`
are also independent.

### An Alternative to Spliting Providers with HOC {#an-alternative-to-spliting-providers-with-hoc}

``` tsx
const withNavigationOpen = (AnyComponent) => {
    // wrap the component from the arguments in React.memo here
    const AnyComponentMemo = React.memo(AnyComponent);
    return (props) => {
        const { open } = useContext(Context);
        // return memoized component here
        // now it won't re-render because of Context changes
        // make sure that whatever is passed as props here don't
        return <AnyComponentMemo {...props} openNav={open} />;
    }
};
```

`AnyComponentMemo` is wrapped in `React.Memo`, the `open` callback is
memoized in the context itself, so `AnyComponentMemo` wont’ re-render if
only the context state changes.

## Maintaining Stateful Closures with Ref {#maintaining-stateful-closures-with-ref}

When passing callbacks to child components, we often face the dilemma
that the callback needs access to some state, so you must put the state
in the corresponding `useCallback`’s dependency array. Now the callback
is recreated every time the state changes, which triggers a re-render of
the callback’s consumer component and break its memoization.

``` tsx
#| caption: Child re-renders on every state update
const [state, setState] = useState();
const onclick = useCallback(() => {
    console.log(state)
}, [state]);

return <ChildMemo onClick={onclick} />;
```

Solution: create the callback only once, inside the callback refer to a
`ref` that is updated with the latest state.

``` tsx
const [value, setValue] = useState();
const ref = useRef();

// !callout[/onClick/] this callback is created only once
const onClick = useCallback(() => {
    ref.current?.();
}, [])

useEffect(() => {
// !callout[/current/] ref.current is updated with the latest state
    ref.current = () => {
        console.log(value);
    };
}, [value]);

return <ChildMemo onClick={onClick} />
```

## Implement debouncing {#implement-debouncing}

There are two variants of debouncing in react

- debounce the state, and only calls the function when the debounced
  state is updated. This is a simpler approach

``` tsx
// use-debounce.ts
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// component.tsx
const [value, setValue] = useState();
const debouncedValue = useDebounce(value, 500);

useEffect(() => {
    callback(debouncedValue);
}, [debouncedValue]);
```

- debounce the function (what the book teaches). With this approach we
  can rely on `debounce` from lodash (or similar utility libraries), the
  gist is that we only create the debounced function once, and use the
  ref trick to make sure it always has the latest state.

``` tsx
import debounce from "lodash.debounce";


function Input() {
    const [value, setValue] = useState();
    const ref = useRef();

    const sendRequest = () => {
        console.log(value)
    }

// !callout[/debouncedRequest/] create the debounced function once
    const debouncedRequest = useMemo(() => {
        const func = () => {
            ref.current?.()
        }

        return debounce(func, 500);
    }, [])


    useEffect(() => {
        // !callout[/current/] update the ref with the latest state
        ref.current = sendRequest;
    }, [value]);


    const onChange = (e) => {
        const value = e.target.value;
        setValue(value);

        debouncedRequest(value)
    }


    return <input onChange={onChange} value={value} />;
}
```

## `useLayoutEffect` {#uselayouteffect}

On a 60 FPS machine, browser repaints the screen approximately every
16ms. When a new task is pulled from the task queue, if the task takes
longer than 16ms, the browser will wait until the task is finished
before repainting the screen. In this code

``` tsx
const Component = () => {
    useLayoutEffect(() => {
    // do something
    })
    return ...
}
```

`useLayoutEffect` **and** the return statement are considered as one
task. In other words `useLayoutEffect` runs synchronously so every UI
update will be in sync with the `useLayoutEffect` side effect. In
contrast, `useEffect` runs asynchronously and is executed after
repainting.

As a result, any side effect in `useLayoutEffect` will be processed
before the browser repaints the screen, at the cost of a slower UI
update. If the `useLayoutEffect` task takes longer than 16ms, the UI
will become unresponsive.

See the react [official
example](https://react.dev/reference/react/useLayoutEffect) for
positioning a tooltip element with `useLayoutEffect`.

To do this, you need to render in two passes:

- Render the tooltip anywhere (even with a wrong position).

- Measure its height and decide where to place the tooltip.

- Render the tooltip again in the correct place.

Even though we have the first, incorrect render, the user won’t see it
because the browser will repaint the screen after the `useLayoutEffect`
task is finished, and by that time the positioning is finished.

``` tsx
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // You don't know real height yet

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // Re-render now that you know the real height
  }, []);

  // ...use tooltipHeight in the rendering logic below...
}
```

## React Portal {#react-portal}

Events from portals propagate according to the React tree rather than
the DOM tree. For example, if you click inside a portal, and the portal
is wrapped in `<div onClick>`, that onClick handler will fire. If this
causes issues, either stop the event propagation from inside the portal,
or move the portal itself up in the react tree.

``` tsx
// clicking the button will trigger the onClick handler
// because this is a React event that follows the react tree
<div onClick={onClick}>
    {createPortal(<button />, document.body)}
</div>
```

In contrast, non-react, standard dom events will propagate according to
the DOM tree. If you listen for the event via `el.addEventListener`, it
won’t fire if the event is triggered by a portal element.

``` tsx
const ref = useRef()

useEffect(() => {
el.addEventListener("click", () => {
    // trying to catch events, originated in the portalled elemented
    // not going to work!!
});
}, [])

return <div ref={ref} />;
```

A gotcha is that `onSubmit` on a form element is a standard DOM event,
so if you have a portal inside a form, the submit event won’t be
triggered by the portal element.

## Data Fetching in `useEffect` with Race Conditions {#data-fetching-in-useeffect-with-race-conditions}

``` tsx
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
}
```

The gist is that the result callback in `fetchBio` captures the “stale”
variable `ignore`, which is a reference that points to `true` if the
component is unmounted. So although we create a new `ignore` variable
for each render, the callback still cancels correctly because it access
the previous scope.
