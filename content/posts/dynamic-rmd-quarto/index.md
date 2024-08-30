---
title: Generating dynamic contents in R Markdown and Quarto
slug: dynamic-rmd-quarto
date: '2023-01-22'
description: |
  Automate report generation in Quarto with parameterized documents.
---


A common scenario in my day-to-day data analysis is that I have many
objects that are typically data frames, and for each of them I want to
create a new section in my Quarto/R Markdown document with their
respective summary statistics. The set of operations to apply are
usually the same, just the data is different. A manual way of doing this
would be copy-pasting the same chunk of code for generating the
summaries, and only change the variable name. For instance:

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

This becomes a pain when they are just so many objects and I have to
change the name one by one. This post introduces a programmatic way of
automating this task using `knit_child` from the `knitr` rendering
engine.

## Using the `knitr` engine

The `knitr` engine has built-in supports for dyanmic, parameterized
documents. For R Markdown, you can pass data to the document using the
`params` argument in `rmarkdown::render()`, learn more at
<https://bookdown.org/yihui/rmarkdown/parameterized-reports.html>. This
is intented for rendering one big parameterized `.Rmd` document.

When it comes to inserting subcontents into either `.qmd` or `.Rmd`
files, `knitr:::knit_child` is the function you need. Similar to
`params` in `rmarkdown::render`, you can pass a environment object to
`knitr:::knit_child` using the `envir` argument. The returned value of
`knit_child` is simply the character string that can be directly
embedded into a documnet, it’s also used in conjunction with the chunk
option `output = 'asis'` (Quarto) or `results = 'asis'` (R Markdown),

`knit_child` accepts both an inline string `text` or a file path `file`.
Below we use the inline string to generate a summary of the `iris` data
frame.

```` markdown
```{r}
# chunk option output = 'asis'
res <- knitr::knit_child(text = c(
    '```{r}',
    'summary(data)',
    '```'
  ), envir = rlang::env(data = iris), quiet = TRUE)
cat(res, sep = "\n")
```
````

``` r
summary(data)
#>   Sepal.Length   Sepal.Width    Petal.Length   Petal.Width        Species  
#>  Min.   :4.30   Min.   :2.00   Min.   :1.00   Min.   :0.1   setosa    :50  
#>  1st Qu.:5.10   1st Qu.:2.80   1st Qu.:1.60   1st Qu.:0.3   versicolor:50  
#>  Median :5.80   Median :3.00   Median :4.35   Median :1.3   virginica :50  
#>  Mean   :5.84   Mean   :3.06   Mean   :3.76   Mean   :1.2                  
#>  3rd Qu.:6.40   3rd Qu.:3.30   3rd Qu.:5.10   3rd Qu.:1.8                  
#>  Max.   :7.90   Max.   :4.40   Max.   :6.90   Max.   :2.5
```

All these combined, we could divide the job into a main document
`main.Rmd` and a template document `_template.Rmd`. In the main
document, we collect all the data, loop through them and insert them
into the template document using `knitr:::knit_child`. Then we can use
the `asis` output option to include the template document into the main
document.

<div class="column-margin">

This will also work for Quarto documents as long as we are using the
knitr engine.

</div>

The example main and template documents are shown below:

<div class="two-column wider">

<div class="div">

In `main.Rmd`

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
      res = knitr::knit_child(
       text = xfun::read_utf8("_template.Rmd"),
       envir = rlang::env(data = data, i = i),
       quiet = TRUE
      )
      cat(res, sep = '\n')
      cat("\n")
    }
    ```

    Here is a list of reports

    ```{r}
    #| results: "asis"
    #| echo: false
    purrr::iwalk(all_data, render_child)
    ```

</div>

<div class="div">

In `_template.Rmd`

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

</div>

</div>

I’ve defined a wrapper function `render_child()` that uses
`knit_child()` under the hood. The key is you can pass arbitrary values
using the `envir` argument. Whatever you need in the template document,
you can pass them in as a named list and convert them into an
environment object using `rlang::env()`.

When you run the main document, it will generate a list of random data
frames, generate a child document for each using the template document,
and inserts the result back to the main document. The result is shown
below:

<div class="column-body-outset"
style="border: 3px solid #627891; padding: 20px; height: 900px">

<iframe src="https://bookdown.org/qiushi/dynamic_contents_in_r_markdown_with_knit_child/" frameBorder="0" style="width:100%;height:100%">
</iframe>

</div>

## A note on `knitr::knit_expand`

[R Markdown
Cookbook](https://bookdown.org/yihui/rmarkdown-cookbook/knit-expand.html)
also introduces a function called `knitr::knit_expand()` that can be
used to insert contents into a template content. An example is shown
below:

``` r
knitr::knit_expand(
  text = "The value of `a` is {{a}}",
  a = 1
)
#> [1] "The value of `a` is 1"
```

Since you can also pass in a `file` argument in `knit_expand`, I was
tempted to use this function with `knit_child` when I started to write
this post. For example

``` r
res <- knnitr::knit_expand(
  file = "template.Rmd"
  data = iris[1:5, ]
)
```

Then you can access `iris` in the template document like so

```` default
---
title: template document
---

```{r}
{{ data }}
```
````

But this will not work. `knitr::knit_expand` simply finds all the
placeholders marked by `{ }`, interpolates them and then pass the text
to the knitting functions. This mechanism works fine you only need to
insert simple primitives, such as strings and numbers, but not if you
want to pass data.frames or other complex objects in general. Then the
knitting functions will see a code chunk like this

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

## Without `knitr`

It you are using Quarto with a different engine than `knitr`, I found no
similar construct as `knitr::knit_child`. Although Quarto offers a
native [variables](https://quarto.org/docs/authoring/variables.html)
mechanism for reading values from configuration files, it’s more
suitable for static data shared across many documents. It also suffers
the same problem as `knitr::knit_expand` that you are limited to
whatever data structure that is supported by YAML.
