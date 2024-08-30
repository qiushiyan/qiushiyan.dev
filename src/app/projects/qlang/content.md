## !intro The Q Programming Language

I read the book [Writing An Interpreter In Go](https://interpreterbook.com/) and decided to build my own programming language. At the time my daily languages are R, Python and JavaScript. While they are great languages, there has always been something I wish I could do better.

Among all the things on my wishlist, some are merely on a syntactic level, for example, there is no literal syntax in R to create a vector or list, we have to use the `c()` and `list()` function. But in Python you can brackets `[]` and bracelets `{}`.

Some problems are more fundamental. I always wish Python and JavaScript would have native support for vector arithmetics. In R, the native vector type has built-in vectorization mechanism. In Python one either have to use for loop and a third party library like `numpy` to do "broadcasting".

Functions should be first-class citizens, which means you can pass them as arguments to other functions, return them from other functions, and bind just like you would do with strings and numbers (Sorry Python but no `def` keyword). And most importantly, why would anyone not love pipes and implicit returns :)

I decide to call my language Q (the letter before R's predecessor S ) and use Go as the host language to build Q's interpreter. For one thing I am interested in people's compliments on Go's simplicity and performance. For another, there is already a popular book on the topic called

So after some weeks I crafted a language that can run a small program like this

## !!steps Primitives

Primitives types in Q includes numbers, strings, vectors, and maps (or objects, dictionaries, lists, whatever you want to call them). And, index in Q starts from 1 (because I love R) .

```python ! primitives.q
# numbers and strings
1 + 3  # 4
"Hello" + " World"  # "Hello World"

# vectors
x = [1, 2, 3]
x[1:2]  # [2, 3]

# literal syntax for creating vectors and maps
data = [
  { name: "Ross", job: "Paleontology" },
  { name: "Monica", job: "Chef" },
]

# let is also an assignment operator
let x = 1

# use <- for assignment, if you want to :)
x <- [1, 2, 3]
```

## !!steps Control flows

Q supports `if` and `for` statements.

```python ! control-flow.q
# if statement
x = 1
if (x == 1) {
  "x is 1"
}

# for statement
for (i in 1:5) {
  print(a[i])
}
# prints 1, 2, 3, 4, 5
```

## !!steps Functions

Functions are defined via the `fn` keyword. Q supports named arguments default arguments. Lexical scoping is used to to resolve variables. You can use the `|>` operator to chain functions calls.

```python ! functions.q
# define a function
let z = 10
let add = fn(x, y = 1) {
  x + y + z
}

add(1, y = 2) |> print()
# prints 13
```

## !!steps Functional programming

Functions are first-class citizens, which brings support for closures, and higher-order functions.

```python ! functional.q
# define closures with default arguments
make_adder = fn(x, y = 1) {
  fn(x) x + y
}
adder = add(y = 10)
adder(1)
# 11

# higher-order functions
map = fn(arr, f) {
    arr_length = len(arr)
    result = vector(len(arr))
    for (i in 1:arr_length) {
        result[i] = f(arr[i])
    }
};

[1, 2, 3] |> map(fn(x) x * 2)
# [2, 4, 6]
```

## !!steps Vectorization

Vectors in Q supports element-wise arithmetics (bye numpy).

```python ! vectorization.q
[1, 2, 3] + [1, 2, 3]
# [2, 4, 6]

[1, 2, 3] * 2
# [2, 4, 6]

# boolean indexing
let x = [1, 2, 3, 4, 5]
x[x > 2]
# [3, 4, 5]
```
