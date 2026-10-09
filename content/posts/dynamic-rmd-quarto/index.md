---
title: Generating Dynamic Contents in R Markdown and Quarto
slug: dynamic-rmd-quarto
date: '2023-01-22'
description: |
  Automate report generation in Quarto with parameterized documents.
tags:
- Quarto
components:
- iframe
headings:
- title: Using the `knitr` Engine
  slug: using-the-knitr-engine
  depth: 2
- title: A Note on `knitr::knit_expand`
  slug: a-note-on-knitrknit_expand
  depth: 3
- title: Without `knitr`
  slug: without-knitr
  depth: 2
---

A common scenario in my day-to-day data analysis is that I have many
objects, typically data frames, and for each of them I want to create a
new section in my Quarto/R Markdown document with its summary
statistics. The operations are usually the same; only the data is
different. The manual way is to copy and paste the same chunk of code
for generating the summaries and change only the variable name. For
instance:

```` default

## Section for Data A

Data A has `r nrow(data_a)` rows and `r ncol(data_a)` columns.

```{r}
summary_fn(data_a)
```

## Section for Data B

Data B has `r nrow(data_b)` rows and `r ncol(data_b)` columns.

```{r}
summary_fn(data_b)
```

## Section for Data C

...
````

This becomes a pain when there are many objects and I have to change the
names one by one. This post shows how to automate this task with
`knit_child` from the `knitr` rendering engine.

## Using the `knitr` Engine {#using-the-knitr-engine}

The `knitr` engine has built-in support for dynamic, parameterized
documents. For R Markdown, you can pass data to the document using the
`params` argument in `rmarkdown::render()` (learn more at
<https://bookdown.org/yihui/rmarkdown/parameterized-reports.html>). This
is intended for rendering one big parameterized `.Rmd` document.

To insert sub-contents into either `.qmd` or `.Rmd` files,
`knitr::knit_child` is the function you need. Similar to `params` in
`rmarkdown::render`, you can pass an environment object to
`knitr::knit_child` using the `envir` argument. `knit_child` returns a
character string that can be embedded directly into a document, so it’s
used together with the chunk option `output = 'asis'` (Quarto) or
`results = 'asis'` (R Markdown).

`knit_child` accepts either an inline string `text` or a file path
`file`. Below we use the inline string to generate a summary of the
`iris` data frame.

```` markdown
```{r}
# chunk option output = 'asis'
res <- knitr::knit_child(text = c(
    "```{r}",
    "summary(data)",
    "```"
), envir = rlang::env(data = iris), quiet = TRUE)
cat(res, sep = "\n")
```
````

``` r
summary(data)
# !collapse(1:7)
#>   Sepal.Length   Sepal.Width    Petal.Length   Petal.Width        Species  
#>  Min.   :4.30   Min.   :2.00   Min.   :1.00   Min.   :0.1   setosa    :50  
#>  1st Qu.:5.10   1st Qu.:2.80   1st Qu.:1.60   1st Qu.:0.3   versicolor:50  
#>  Median :5.80   Median :3.00   Median :4.35   Median :1.3   virginica :50  
#>  Mean   :5.84   Mean   :3.06   Mean   :3.76   Mean   :1.2                  
#>  3rd Qu.:6.40   3rd Qu.:3.30   3rd Qu.:5.10   3rd Qu.:1.8                  
#>  Max.   :7.90   Max.   :4.40   Max.   :6.90   Max.   :2.5
```

Putting it all together, we can divide the job into a main document
`main.Rmd` and a template document `_template.Rmd`. In the main
document, we collect all the data, loop through them and insert them
into the template document using `knitr::knit_child`. Then we can use
the `asis` output option to include the template document in the main
document.

<div class="column-margin">

This will also work for Quarto documents as long as we are using the
knitr engine.

</div>

The example main and template documents are shown below:

<div class="two-column wider">

<div class="col-span-1">

In `main.Rmd`

```` markdown
---
title: "Dynamic contents in R Markdown and Quarto with `knit_child()`"
toc: true
---

Generate random dataset

```{r}
#| echo: false
random_data <- function(n) {
  data.frame(
    x = rnorm(n),
    y = rnorm(n)
  )
}
```

```{r}
all_data <- purrr::map(1:5, ~ random_data(round(runif(1, 10, 100))))
```

```{r}
render_child <- function(data, i) {
  res <- knitr::knit_child(
    text = xfun::read_utf8("_template.Rmd"),
    envir = rlang::env(data = data, i = i),
    quiet = TRUE
  )
  cat(res, sep = "\n")
  cat("\n")
}
```

Here is a list of reports

```{r}
#| results: "asis"
#| echo: false
purrr::iwalk(all_data, render_child)
```
````

</div>

<div class="col-span-1">

In `_template.Rmd`

```` markdown
## Dataset `r i`

Dataset `r i` has `r nrow(data)` rows.

### Summary

```{r}
#| echo: false
summary(data)
```

### Plot

```{r}
#| echo: false
#| fig-align: center
plot(data)
```
````

</div>

</div>

I’ve defined a wrapper function `render_child()` that uses
`knit_child()` under the hood. The key is that you can pass arbitrary
values using the `envir` argument: pass whatever the template document
needs as a named list and convert it into an environment object with
`rlang::env()`.

When you run the main document, it generates a list of random data
frames, generates a child document for each using the template document,
and inserts the results back into the main document. The result is shown
below:

<div class="column-body-outset">

<iframe src="https://bookdown.org/qiushi/dynamic_contents_in_r_markdown_with_knit_child/">
</iframe>

</div>

### A Note on `knitr::knit_expand` {#a-note-on-knitrknit_expand}

[R Markdown
Cookbook](https://bookdown.org/yihui/rmarkdown-cookbook/knit-expand.html)
also introduces `knitr::knit_expand()`, which inserts contents into a
template. For example:

``` r
knitr::knit_expand(
    text = "The value of `a` is {{a}}",
    a = 1
)
#> [1] "The value of `a` is 1"
```

Since you can also pass a `file` argument to `knit_expand`, I was
tempted to use this function with `knit_child` when I started writing
this post. For example:

``` r
res <- knitr::knit_expand(
    file = "template.Rmd",
    data = iris[1:5, ]
)
```

Then you can access `iris` in the template document like so:

```` default
---
title: template document
---

```{r}
{{ data }}
```
````

But this will not work. `knitr::knit_expand` simply finds all the
placeholders marked by `{ }`, interpolates them and then passes the text
to the knitting functions. This works fine if you only need to insert
simple primitives, such as strings and numbers, but not if you want to
pass data.frames or other complex objects. The knitting functions will
then see a code chunk like this:

```` default
```{r}
c(5.1, 4.9, 4.7, 4.6, 5)
c(3.5, 3, 3.2, 3.1, 3.6)
c(1.4, 1.4, 1.3, 1.5, 1.4)
c(0.2, 0.2, 0.2, 0.2, 0.2)
c(1, 1, 1, 1, 1)
```
````

which is not valid R syntax.

## Without `knitr` {#without-knitr}

If you are using Quarto with an engine other than `knitr`, I found no
construct similar to `knitr::knit_child`. Although Quarto offers a
native [variables](https://quarto.org/docs/authoring/variables.html)
mechanism for reading values from configuration files, it’s intended for
static data that should be shared across multiple documents. It also has
the same problem as `knitr::knit_expand`: you are limited to the data
structures YAML supports.
