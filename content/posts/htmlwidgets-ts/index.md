---
title: Developing htmlwidgets in R with TypeScript and Esbuild
date: '2022-01-29'
description: |
  Frontend tools that add type safety and speed to htmlwidgets development.
tags:
- R
- TypeScript
headings:
- title: The `packer` Package
  slug: the-packer-package
  depth: 2
- title: Using TypeScript and esbuild
  slug: using-typescript-and-esbuild
  depth: 2
---

<my-callout>

This post assumes familiarity with R package development, JavaScript and
Node.js. I recommend the second chapter of
<a href="https://book.javascript-for-r.com">JavaScript for R</a> as a
starter.

</my-callout>

The `htmlwidgets` R package provides a friendly interface for developing
R packages that wrap JavaScript libraries. An htmlwidget is nothing more
than a normal R plot plus interactivity powered by JavaScript. The
package abstracts away many details of juggling both JavaScript and R,
most notably dependency management.

An example from the [JavaScript for
R](https://book.javascript-for-r.com/) book shows the development of the
[`gior`](https://github.com/JohnCoene/gior) package, which corresponds
to the [`gio.js`](https://giojs.org/) JavaScript library. The
[`inst/htmlwidgets`](https://github.com/JohnCoene/gior/tree/master/inst/htmlwidgets)
directory contains the dependencies required by `gio.js`. This file is
the entry point of creating the widget. It depends on JavaScript
libraries including `gio.js`, `three.js`, `HTMLWidgets` and `Shiny`. We
don’t need to worry about including `HTMLWidgets` or `Shiny` ourselves,
since R will do it for us.

For the first two dependencies, we can download them from a CDN and
include them in the
[`inst/htmlwidgets/lib`](https://github.com/JohnCoene/gior/tree/master/inst/htmlwidgets/lib)
directory. Lastly, we include a
[`gior.yaml`](https://github.com/JohnCoene/gior/blob/master/inst/htmlwidgets/gior.yaml)
file that declares the locations of the dependencies:

``` yaml
#| filename: gior.yaml
dependencies:
 - name: three
   version: 97
   src: htmlwidgets/lib/three
   script: three.min.js
 - name: gio
   version: 2.0
   src: htmlwidgets/lib/gio-2.0
   script: gio.min.js
```

Now, whenever we create a widget from R, the rendering context
automatically serves all the JavaScript files. This workflow is
convenient for developing packages that don’t require much work on the
JavaScript side: all we need to do is call some initialization functions
in `gior.js`. However, if the JavaScript side involves more than passing
a few lines of options, this setup is not sufficient. Since JavaScript
dependencies are managed from R and never declared in `gior.js`, we
don’t get the nice features a modern text editor provides, such as
autocompletion, snippets, linting and IntelliSense. Moreover, when our
package gets larger, we might want to split the JavaScript code into
separate modules rather than cluttering the `gior.js` file, and it’s not
fun to do the bundling ourselves.

For this reason, it makes sense to have more control over how JavaScript
dependencies are managed, rather than just downloading and including a
dist file. The end result is the same: we include one or more JavaScript
files for the plot. The difference is that instead of using files
provided by a CDN, we install the JavaScript packages and do the
bundling ourselves. The [`packer`](https://github.com/JohnCoene/packer)
package provides a solution for this.

## The `packer` Package {#the-packer-package}

In the JavaScript world, dependency management is done through Node.js
and a package manager of choice, like npm, yarn or pnpm. These package
managers create a project-specific environment into which packages are
installed. Then we use a bundler like webpack to bundle all files into a
single file, which is served every time a widget is created from R.
`packer` scaffolds a project structure for this and provides an R
interface, so we can still do all the work through R commands. The
following two commands scaffold an htmlwidgets package powered by
packer:

``` r
usethis::create_package("<package-name>")
packer::scaffold_widget("<widget-name>")
```

This generates the following directory tree:

    ├── DESCRIPTION
    ├── NAMESPACE
    ├── R
    │   ├── <widget-name>.R
    ├── inst
    │   └── packer
    ├── node_modules
    │   └── ...
    ├── package.json
    ├── srcjs
    │   ├── config
    │   ├── inputs
    │   └── index.js
    ├── webpack.common.js
    ├── webpack.dev.js
    └── webpack.prod.js

A `node_modules` folder is created for storing JavaScript dependencies.
Note that we now manage JavaScript dependencies ourselves and can
install them with `packer::yarn_install` from R or simply `yarn add`
from the command line.

The three files starting with `webpack` are webpack configurations for
bundling. `webpack.common.js` stores shared options for both development
and production, `webpack.dev.js` is used for development, and
`webpack.prod.js` for production. Three webpack options matter most for
our purposes, and packer sets them in the `srcjs/config` directory:

- `output` determines the dist file name and location. It should be
  `<widget-name>.js` in the `inst/htmlwidgets` directory so that R knows
  to include it.

- `entryPoints` determines the starting point of the bundling process.
  This can be any top-level file that imports other dependencies and
  calls `HTMLWidgets.widget()`. packer uses
  `srcjs/widgets/<widget-name>.js` as the entry point by convention.

- `externals` declares the dependencies that we don’t need webpack to
  resolve. This includes `Shiny` and `HTMLWidgets`, which are outside
  the `node_modules` folder and added by R. If we don’t declare them,
  webpack will report an error because it can’t find them.

There is also a `loaders` option that tells webpack how to preprocess
each file type. For a regular JavaScript website, this includes
different preprocessors for JavaScript, CSS, SCSS, etc. In the context
of htmlwidgets, packer sets it all up.

Now, if we run `packer::bundle_dev()`, it invokes `npm run development`
from the `scripts` section in `package.json`, which runs webpack with
the development configuration. webpack bundles all necessary files into
`inst/htmlwidgets`. Any time we make a change to the `srcjs` directory,
we need to run `packer::bundle_dev()` to update the dist file.

This time, our project follows the standard JavaScript project structure
with `package.json` and `node_modules`, so when we write JavaScript
code, our text editor can resolve the dependencies and provide
IntelliSense. We can also structure the code however we like, as long as
it is imported by the entry file.

## Using TypeScript and esbuild {#using-typescript-and-esbuild}

packer produces decent boilerplate if you are happy with simple
JavaScript libraries and webpack. However, if you need TypeScript, Sass
or frameworks like React and Svelte, configuring webpack can be
notoriously time-consuming. packer also provides templates for the
JavaScript versions of React and Vue, but in my opinion they still
require a fair amount of customization. Further, webpack is sometimes
considered outdated, with bigger bundle sizes and slower bundling.

So if, like me, you go out of your way to make a package as “optimized”
as possible, you may be better off with a personal setup similar to
packer with optimized replacements. In essence, it’s just a matter of
producing a dist file in the `inst/htmlwidgets/` directory with the best
development experience, and I’ll share the combo I find most
comfortable: TypeScript replaces JavaScript for static typing, and
esbuild replaces webpack with hundreds of times faster performance,
simpler configuration, and native TypeScript support.

While developing the [xkcd](https://github.com/qiushiyan/xkcd)
htmlwidgets package, I migrated a packer-generated setup to one with
TypeScript and esbuild.

The first step is to remove webpack-related dependencies from
`package.json` and run `yarn update`. Then install TypeScript, esbuild
and whatever JavaScript library you want to work with:

``` bash
yarn add -D typescript esbuild @types/node
yarn add <target-package>
```

We can also remove the webpack configurations in `srcjs/config` and the
`webpack.*.js` files in the root directory.

At this point, our `package.json` file should look like this:

``` json
#| filename: package.json
{
    "devDependencies": {
        "@types/node": "^17.0.12",
        "esbuild": "^0.14.14",
        "typescript": "^4.5.5"
    },
    "dependencies": {
        "chart.xkcd": "^1.1.13" // here goes all js dependencies
    }
}
```

Next, let’s create the entry point file. I like to name it `index.ts`
under the `srcts` directory:

``` typescript
#| filename: srcts/index.ts
import * as chartXkcd from "chart.xkcd";

HTMLWidgets.widget({
  name: "xkcd",
  type: "output",
  factory: function (el: HTMLElement, width: number, height: number) {
    // TODO: define shared variables for this instance
    return {
      // !callout[/renderValue/] plotting logic
      renderValue: function (x: any) {

      },
      // !callout[/resize/] resize logic when screen size changes
      resize: function (width: number, height: number) {

      },
    };
  },
});
```

Now, let’s configure esbuild to meet the requirements of htmlwidgets.
Since esbuild doesn’t automatically pick up a configuration file when
invoked from the command line, we’ll create a normal `esbuild.js` file
in the root directory and run it with `node`.

``` javascript
#| filename: esbuild.js
const esbuild = require("esbuild");
const path = require("path");

esbuild
  .build({
    entryPoints: [path.join(__dirname, "srcts/index.ts")],
    bundle: true,
    outfile: path.join(__dirname, "inst/htmlwidgets/xkcd.js"),
    platform: "node",
    format: "cjs",
    external: ["Shiny", "HTMLWidgets"],
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.log("watch build succeeded:", result);
      },
    },
  })
  .catch((err) => {
    process.stderr.write(err.stderr);
    process.exit(1);
  });
```

Note that esbuild’s configuration is similar to webpack’s: we again
declare the entry file (`entryPoints`), where the bundled file should go
(`outfile`), and external dependencies (`external`). The last step is
adding a command that invokes this script to do the bundling:

``` json
#| filename: package.json
{
  "scripts": {
        "watch": "node esbuild.js"
    },
    "devDependencies": {
        "@types/node": "^17.0.12",
        "esbuild": "^0.14.14",
        "typescript": "^4.5.5"
    },
    "dependencies": {
        "chart.xkcd": "^1.1.13"
    }
}
```

Now, run `yarn watch` from the command line to run the build script
`esbuild.js`. esbuild starts with the message:

``` bash
yarn watch
#> yarn run v1.22.17
#> $ node esbuild.js
#> watch build succeeded: { errors: [], warnings: [], stop: [Function: stop] }
```

This creates the `<widget-name>.js` dist file under `inst/htmlwidgets/`.
Because we set `watch` in `esbuild.js`, esbuild watches the entry file
and related modules and rebuilds the bundle whenever they change. So if
we only change the JavaScript side, the widget updates automatically the
next time it’s created, and there is no need to call
`packer::bundle_dev()` again.

With this setup, it’s easy to include any additional libraries. For
example, if you want to include [tailwindcss](https://tailwindcss.com/)
in your widget, you can simply `yarn add` tailwind and look up the
corresponding tailwind-esbuild configuration.
