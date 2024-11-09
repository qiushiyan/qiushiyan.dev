---
title: Web Performance
slug: web-performance
date: '2024-10-31'
category: Web Development
headings:
- title: Critical Rendering Path
  slug: critical-rendering-path
  depth: 2
- title: Render-blocking and Parser-blocking Resources
  slug: render-blocking-and-parser-blocking-resources
  depth: 2
- title: '`defer` and `async` scripts'
  slug: defer-and-async-scripts
  depth: 3
- title: The Preload Scanner
  slug: the-preload-scanner
  depth: 3
- title: 'Resource Hints: Preconnect, Prefetch, and Preload'
  slug: resource-hints-preconnect-prefetch-and-preload
  depth: 2
- title: '`fetchpriority` attribute'
  slug: fetchpriority-attribute
  depth: 3
- title: Optimizing CSS
  slug: optimizing-css
  depth: 2
- title: Optimizing Images
  slug: optimizing-images
  depth: 2
- title: Lazy Loading
  slug: lazy-loading
  depth: 3
- title: Image Formats
  slug: image-formats
  depth: 3
- title: Responsive Images
  slug: responsive-images
  depth: 3
- title: The `picture` Element
  slug: the-picture-element
  depth: 3
- title: decoding
  slug: decoding
  depth: 3
- title: Optimizing Fonts
  slug: optimizing-fonts
  depth: 2
- title: Waterfall Chart and Flame Chart
  slug: waterfall-chart-and-flame-chart
  depth: 2
- title: LCP (Largest Contentful Paint)
  slug: lcp-largest-contentful-paint
  depth: 2
- title: First Contentful Paint
  slug: first-contentful-paint
  depth: 3
- title: Time to First Byte (TTFB)
  slug: time-to-first-byte-ttfb
  depth: 3
- title: Improve FCP and LCP
  slug: improve-fcp-and-lcp
  depth: 3
- title: CLS (Cumulative Layout Shift)
  slug: cls-cumulative-layout-shift
  depth: 2
- title: Improve CLS
  slug: improve-cls
  depth: 3
- title: INP (Interaction to Next Paint)
  slug: inp-interaction-to-next-paint
  depth: 2
- title: FID (First Input Delay)
  slug: fid-first-input-delay
  depth: 3
- title: Optimize INP
  slug: optimize-inp
  depth: 2
- title: Other Topics
  slug: other-topics
  depth: 2
- title: '`PeformanceObserver`'
  slug: peformanceobserver
  depth: 3
- title: Browser Support
  slug: browser-support
  depth: 3
- title: Legacy Metrics
  slug: legacy-metrics
  depth: 3
- title: Tools
  slug: tools
  depth: 2
---

Some general resources

- The [performance](https://web.dev/learn/performance) section on
  https://web.dev

- [Web performance 101](https://3perf.com/talks/web-perf-101/)

- [Frontend Masters
  course](https://frontendmasters.com/courses/web-perf-v2/)

## Critical Rendering Path {#critical-rendering-path}

The critical rendering path refers to the steps involved until the web
page starts rendering in the browser, which is the **first paint**. To
render pages, browsers need the HTML document itself as well as all the
critical resources necessary for rendering that document.

![CRP
diagram](https://web.dev/static/learn/performance/understanding-the-critical-path/image/fig-1-v2.svg)

**Resources that on are CRP**

- Part of the HTML. HTML are parsed incrementally, so the browser can
  start rendering the page before the entire HTML is downloaded.

- Render-blocking CSS in the `<head>` element.

- Render-blocking JavaScript in the `<head>` element.

Importantly, for the initial render, the browser will **not typically
wait for**:

- All of the HTML.

- Fonts.

- Images.

- Non-render-blocking JavaScript outside of the `<head>` element (for
  example, `<script>` elements placed at the end of the HTML).

- Non-render-blocking CSS outside of the `<head>` element, or CSS with a
  media attribute value that does not apply to the current viewport.

## Render-blocking and Parser-blocking Resources {#render-blocking-and-parser-blocking-resources}

- **Render-blocking resources**: the browser pauses page rendering until
  it has dealt with them. CSS that are imported via
  `<link rel="stylesheet" href="...">` falls into this category by
  default. It is implied that although the rendering is paused, the
  browser can still parse the rest of the HTML and look for other work
  to do in the meantime.

**Render-blocking resources does not necessarily affect initial
render**. A `<link rel="stylesheet" />` is render-blocking regardless of
if it is placed in `<head>` or not, it will block the **final** paint of
the browser. But stylesheets outside of `<head>`is moved out of the CRP
and does not affect FCP.

- **Parser-blocking resources**: prevent the browser from looking for
  other work to do by continuing to parse the HTML. JavaScript by
  default is parser-blocking (unless specifically marked as `defer` or
  `async`), as JavaScript can change the DOM or the CSSOM upon its
  execution.

**Parser-blocking resources are effectively render-blocking as well**.
Since the parser can’t continue past a parsing-blocking resource until
it has been fully processed, it can’t access and render the content
after it. The browser can render any HTML received so far while it
waits, but where the critical rendering path is concerned, any
parser-blocking resources in the `<head>` effectively mean that all page
content is blocked from being rendered.

### `defer` and `async` scripts {#defer-and-async-scripts}

TLDR: you should almost always use `defer` instead of `async` to create
non parser-blocking scripts.

`defer` and `async` scripts allow external scripts to load without
blocking the HTML parser while scripts (including inline scripts) with
type=“module” are deferred automatically. However, async and defer have
some differences that are important to understand.

`defer` scripts are executed until the HTML document is completely
parsed (before the `DOMContentLoaded` event), and multiple `defer`
scripts are executed in the order of their appearance in the document

`async` scripts are executed as soon as they are downloaded, which means
they can be executed out of order. This can cause issues if the script
relies on other scripts or the DOM being in a certain state.

![A digram showing the differences between defer and async
scripts](https://web.dev/static/learn/performance/optimize-resource-loading/image/fig-2.svg)

### The Preload Scanner {#the-preload-scanner}

The preload scanner is a browser optimization in the form of a secondary
HTML parser that scans the raw HTML response to find and speculatively
fetch resources even if the primary parser is blocked on a
parser-blocking resource.

To take advantage of the preload scanner, critical resources should be
included in HTML markup sent by the server. The following resource
loading patterns are not discoverable by the preload scanner:

- Images loaded by CSS using the background-image property. These image
  references are in CSS, and can’t be discovered by the preload scanner.

- Dynamically-loaded scripts in the form of `<script>` element markup
  injected into the DOM using JavaScript or modules loaded using dynamic
  `import()`. This is usually not a problem because we typically only
  dynamically load add-on libraries anyway, and they are useful for
  code-splitting.

- HTML rendered on the client using JavaScript. Such markup is contained
  within strings in JavaScript resources, and isn’t discoverable by the
  preload scanner.

- CSS `@import` declarations.

If avoiding such patterns isn’t possible, however, you may be able to
use a preload hint to avoid resource discovery delays.

## Resource Hints: Preconnect, Prefetch, and Preload {#resource-hints-preconnect-prefetch-and-preload}

Resource hints can help developers further optimize page load time by
informing the browser how to load and prioritize resources. An initial
set of resource hints such as `preconnect` and `dns-prefetch` were the
first to be introduced. Over time, however, `preload`, and the Fetch
Priority API have followed to provide additional capabilities.

1.  **Preconnect**: “I’ll need this CONNECTION soon”. This is for
    third-party APIs, fonts, etc.

<!-- -->

    <link rel="preconnect" href="https://api.example.com">

    - Medium priority
    - Only sets up connection (DNS, TCP, TLS)
    - For third-party domains
    - No download, just connection
    - Example: Google Fonts, CDN servers

By using `preconnect`, you anticipate that the browser plans to connect
to a specific cross-origin server in the very near future, and that the
browser should open that connection as soon as possible, ideally before
waiting for the HTML parser or preload scanner to do so.

A closely related hint is `dns-prefetch`, because opening connections to
cross-origin servers early can significantly improve initial page load
time, it may not be either reasonable or possible to establish
connections to many cross-origin servers at once. If you’re concerned
that you may be overusing preconnect, use `dns-prefetch` instead, which
does not make a connect but only does a DNS lookup.

2.  **Prefetch**: “I might need this resource LATER”. The `prefetch`
    directive is used to initiate a low priority request for a resource
    likely to be used for future navigations: This is what Next.js
    `router.prefetch(href)` does. It gets a list of scripts for `href`
    and append `<link rel="prefetch" href="script.js">` to the head.

<!-- -->

    <link rel="prefetch" href="/next-page.js">

    - Low priority
    - Downloads during idle time
    - For future/next page resources
    - Optional 'as' attribute
    - Example: next page JS/CSS

3.  **Preload**: “I need this resource NOW”. Usually for fonts and LCP
    images. The preload directive is used to initiate an early request
    for a resource required for rendering the page.

<!-- -->

    <link rel="preload" href="/style.css" as="style">

    - High priority
    - Downloads immediately
    - For critical current page resources
    - Must specify 'as' attribute
    - Example: critical CSS, fonts, hero images

### `fetchpriority` attribute {#fetchpriority-attribute}

Modern browsers load resources in two phases. The first phase is
reserved for critical resources and ends once all blocking scripts have
been downloaded and executed. During this phase, Low priority resources
may be delayed from downloading. By using `fetchpriority="high"` you can
increase the priority of a resource, enabling the browser to download it
during the first phase.

By default, images are fetched with a **lower** priority. After layout,
if the image is found to be within the initial viewport, the priority is
increased to **High** priority. In the snippet below, fetchpriority
immediately tells the browser to download the larger LCP image with a
High priority, while the less important thumbnail images are downloaded
with a lower priority.

``` html
<div class="gallery">
  <div class="poster">
    <img src="img/poster-1.jpg" fetchpriority="high">
  </div>
  <div class="thumbnails">
    <img src="img/thumbnail-2.jpg" fetchpriority="low">
    <img src="img/thumbnail-3.jpg" fetchpriority="low">
    <img src="img/thumbnail-4.jpg" fetchpriority="low">
  </div>
</div>
```

You can use the attribute with `<link>`, `<img>`, and `<script>`
elements.

<my-callout title="Difference between preload and fetchpriority='high'">

`rel="preload"` tells the browser to download the image as soon as
possible, before it’s actually discovered in the HTML. Best for images
that appear “later” in your HTML but are actually critical for LCP.

`fetchpriority` does not start the download earlier, but directly
signals to the browser’s resource prioritization system that this image
is high priority, and ensures the image gets more network resources when
competing with other resources. Best for images that are already
discoverable early in your HTML

**Summary**

- Preload affects when the download starts. `fetchpriority` affects
  resource allocation during download.

- Preload is a resource hint that requires an additional HTTP request,
  `fetchpriority` is just an attribute

</my-callout>

## Optimizing CSS {#optimizing-css}

There are render-blocking CSS and non-render blocking CSS.

- **Render-blocking**: stylesheets in the `<head>` element

- **Non-render-blocking**: CSS outside of the

  <head>

  element, or CSS with a `media` attribute value that does not apply to
  the current viewport.

We want to divide the CSS into two parts: critical CSS and non-critical
CSS.

For critical CSS, we want the browser to fetch them as soon as possible.
Techniques include

- inline critical CSS in the `<head>` element in a `<style>` tag to
  avoid an extra network request

  ``` html
  <style>
    /* Critical CSS */
  </style>
  ```

- download non-critical css as `print` styles

  ``` html
  <link rel="stylesheet" href="print.css" media="print" onload='this.media="all"'>
  ```

  For `media="print"`:

      Not render-blocking
      Browser downloads with low priority
      Doesn't block first paint
      CSSOM still built but not needed for initial render

  For `media="all"` or no media:

      Render-blocking
      High priority download
      Must be processed before first paint

- minification, remove unused css, use the
  [Coverage](https://developer.chrome.com/docs/devtools/css/reference/#coverage)
  tab for checking,

- avoid sequential chains, use a bundler instead

  ``` html
  <!-- Bad -->
  <link rel="stylesheet" href="globals.css">
  <link rel="stylesheet" href="typography.css">
  <link rel="stylesheet" href="layout.css">
  ```

- avoid `@import` specifier in CSS. Compared to `link`, the difference
  between these two approaches is that the HTML `<link>` element is part
  of the HTML response, and therefore discovered much sooner than a CSS
  file downloaded by an `@import` declaration, can `@import` stylesheets
  cannot be discovered by the preload scanner. If you can’t remove
  `@import`, use a `preload` hint.

## Optimizing Images {#optimizing-images}

### Lazy Loading {#lazy-loading}

Lazy loading can be used to remove assets on the critical path, and
defer loading of non-critical assets.

The `loading` attribute determines WHEN the browser should start loading
the image:

- `loading="eager"` (default) - loads immediately

- `loading="lazy"` - defers loading until near viewport, **don’t** do
  this for images that are in the initial viewport.

Compared to `loading`, `fetchpriority` determines HOW URGENTLY the
browser should download the resource once it starts loading.

``` html
<!-- The high priority only takes effect AFTER the lazy loading threshold is met -->
<img src="image.jpg" loading="lazy" fetchpriority="high">
```

For LCP images, you typically want:

``` html
<!-- using the loading="eager" default -->
<img src="hero.jpg"  fetchpriority="high">
```

For below-the-fold images:

``` html
<!-- using the fetchpriority="auto" default -->
<img src="below-fold.jpg" loading="lazy">
```

<my-callout title="Lazy Loading iframes">

The `loading` attribute also applies to `<iframe>` elements.

- “eager” is the default value. It informs the browser to load the
  `<iframe>` element’s HTML and its sub-resources immediately.

- “lazy” defers loading the `<iframe>` element’s HTML and its
  sub-resources until it is within a predefined distance from the
  viewport.

</my-callout>

### Image Formats {#image-formats}

Modern image formats like WebP and AVIF may provide better compression
than PNG or JPEG,

If you can’t use a newer format, use a compression tool.

PNG compressing tool https://tinypng.com/

### Responsive Images {#responsive-images}

Understanding the `srcset` and `sizes` attributes

- `srcset` specifies a list of possible image sources the browser may
  use. Each image source specified must include the image URL, and a
  width or pixel density descriptor.

  ``` html
  <img
    alt="An image"
    width="500"
    height="500"
    src="/image-500.jpg"
    srcset="/image-500.jpg 1x, /image-1000.jpg 2x, /image-1500.jpg 3x"
  >
  ```

  The preceding HTML snippet uses the pixel density descriptor to hint
  the browser to use `image-500.png` on devices with a DPR of 1,
  `image-1000.jpg` on devices with a DPR of 2, and `image-1500.jpg` on
  devices with a DPR of 3.

- `sizes` make the container size responsive by specifying the “hole”
  for the image dependent upon a media condition

  ``` html
  <img
    alt="An image"
    width="500"
    height="500"
    src="/image-500.jpg"
    srcset="/image-500.jpg 500w, /image-1000.jpg 1000w, /image-1500.jpg 1500w"
    sizes="(min-width: 768px) 500px, 100vw"
  >
  ```

  The `sizes` attribute tells the browser that:

  When viewport width ≥ 768px, the image will be 500px wide Otherwise,
  the image will be 100% of viewport width

  Using this information, the browser might choose:

  - /image-500.jpg for 1x displays when viewport ≥ 768px

  - /image-1000.jpg for 2x displays when viewport ≥ 768px

  The most appropriate version based on viewport width when viewport \<
  768px. The browser aims to select the smallest image that will still
  look good at the final rendered size on the user’s device.

![`srcset` combined with sizes](srcset-sizes.png)

### The `picture` Element {#the-picture-element}

``` html
<picture>
  <source
    media="(min-width: 560px)"
    srcset="/image-500.jpg, /image-1000.jpg 2x, /image-1500.jpg 3x"
  >
  <source
    media="(max-width: 560px)"
    srcset="/image-500.jpg 1x, /image-1000.jpg 2x"
  >
  <img
    alt="An image"
    width="500"
    height="500"
    src="/image-500.jpg"
  >
</picture>
```

![Comparing the picture element with srcset and
sizes](picture-element.png)

### decoding {#decoding}

``` html
<img src="image.jpg" decoding="async">
```

The `decoding` attribute tells the browser how it should decode the
image.

- A value of `"async"` tells the browser that the image can be decoded
  asynchronously, possibly improving the time to render other content.
  Next.js uses this by default.

- A value of `"sync"` tells the browser that the image should be
  presented at the same time as other content.

- The browser default value of `"auto"` allows the browser to decide
  what is best for the user.

The effect of the decoding attribute may only be noticeable on very
large, high-resolution images which take a much longer time to decode.

## Optimizing Fonts {#optimizing-fonts}

By default, the browser only starts to download a font when a
`font-face` declaration exists and the font is used in the HTML

``` css
@font-face {
  font-family: "Open Sans";
  src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2");
}

h1 {
  font-family: "Open Sans";
}
```

In the example above, downloading begins when the browser encounters the
`h1` element.

There are ways to let the browser start downloading the font earlier

- use a `preload` hint

  ``` html
  <link rel="preload" as="font" href="/fonts/OpenSans-Regular-webfont.woff2" crossorigin>
  ```

  If the font is hosted by a third party provider (e.g. Google Fonts),
  we can also use a `preconnect` hint to establish a connection to the
  font provider’s server.

  ``` html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ```

- Inline font-related CSS

  ``` html
  <style>
  @font-face {
    font-family: "Dancing Script";
    src: url("/fonts/DancingScript-Regular.woff2?v=1676325285146");
  }

  .fancy {
    font-family: "Dancing Script";
  }
  </style>
  ```

- Use `woff2` only, which has the best compression

- Subset your font. For example, the
  https://fonts.googleapis.com/css?family=Roboto&subset=latin URL serves
  a style sheet with the Roboto web font that only use the Latin
  alphabet. This can reduce download size.

After the font is downloaded, there is another aspect by which we can
control the font rendering behavior. Possible values are

- the default `block`: browser blocks the rendering of any text that
  uses the specified web font before it is downloaded. Different
  browsers behave slightly differently. Chromium and Firefox block
  rendering for up to a maximum of 3 seconds before using a fallback.
  Safari blocks indefinitely until the web font has loaded.

- `swap` does not block rendering, and shows the text immediately in a
  fallback before swapping in the specified web font. This lets you show
  your content immediately without waiting for the web font to download.
  This will hurt CLS.

- `optional` is in between of `block` and `swap`. It only uses the web
  font resource if it downloads within 100 milliseconds. If a web font
  takes longer than that to load, it isn’t used on the page, and the
  browser uses the fallback typeface for the current navigation while
  the web font is downloaded in the background and placed in the browser
  cache. As a result, subsequent page navigations can use the web font
  immediately, since it’s already downloaded. `font-display: optional`
  avoids the layout shift seen with `swap`, but some users don’t see the
  web font if it arrives too late on the initial page navigation.

## Waterfall Chart and Flame Chart {#waterfall-chart-and-flame-chart}

Waterfall chart

![example waterfall
chart](https://web.dev/static/articles/identify-resources-via-network-panel/image/chrome-devtools-network-4df907e09f1c1_1920.png)

Waterfall chart usually shows the time frame at a 10ms resolution and
the flame chart provides a more detailed view of the time spent on each
task, it looked at each task and what child tasks it spins up. Take the
following example HTML

``` html
<html>
  <body>
    <script>
      window.addEventListener('load', () => {
        var el = document.createElement('div');
        el.textContent = 'Hello, world!';
        document.body.appendChild(el);
      });
    </script>
  </body>
</html>
```

The flame chart would be

    Task
    |-----------Task 1----------|-----------Task 2----------|----Task 3----|

       Parse HTML                Event: load              Layout
       |---------|              |--------------|         |----|

           Evaluation script         Function call
           |---------|              |----------|

           Compile code             Compile    (function)
           |--------|              |------|    |--------|

## LCP (Largest Contentful Paint) {#lcp-largest-contentful-paint}

LCP reports the render time of the largest image, text block, or video
visible in the viewport, relative to when the user first navigated to
the page. The candidates are

- `<img>` elements: (the first frame presentation time is used for
  animated content such as GIFs or animated PNGs), or `<image>` elements
  inside an `<svg>` element

- `<video>` elements: the first frame presentation time is used for
  video content

- An element with a background image loaded via the `url()` function

- Block-level elements containing text nodes or other inline-level text
  elements

In come cases, a candidate will be excluded so that developers can’t
trick the metric by adding a easy-to-load element.

- Elements with an opacity of 0, that are invisible to the user

- Elements that cover the full viewport, that are likely considered as
  background rather than content

- Placeholder images or other images with a low entropy (data size /
  display size), that likely don’t reflect the true content of the page

Among all valid candidates, the one with the largest area is chosen as
the LCP candidate. The size of an element is typically the size that’s
visible to the user within the view port. For images, this is the
visible size, for text elements, this is te rectangle that contains the
text. The size does not count margins, paddings, or borders.

To provide a good user experience, sites should strive to have Largest
Contentful Paint of **2.5** seconds or less.

### First Contentful Paint {#first-contentful-paint}

First Contentful Paint (FCP) measures the time from when the user first
navigated to the page to when any part of the page’s content is rendered
on the screen. For this metric, “content” refers to text, images
(including background images), `<svg>` elements, or non-white `<canvas>`
elements.

To provide a good user experience, sites should strive to have a First
Contentful Paint of **1.8** seconds or less.

### Time to First Byte (TTFB) {#time-to-first-byte-ttfb}

TTFB is a metric that measures the time between the request for a
resource and when the first byte of a response begins to arrive.

This is measuring the performance for the server, and is generally not
related to client-side performance. But TTFB is the first step before
FCP and LCP can be measured, so it is important to know how to optimize
it.

TTFB is the sum of the following request phases:

- Redirect time

- Service worker startup time (if applicable)

- DNS lookup

- Connection and TLS negotiation

- Request, up until the point at which the first byte of the response
  has arrived

TTFB is not a core web vital or ranking metric. But it does affect LCP.
As a rough guide, most sites should strive to have a TTFB of 0.8 seconds
or less.

Ways to improve TTFB:

- **compress** your assets: use gzip or brotli, Vercel uses brotli by
  default

- use efficient **protocols** like HTTP/2 or HTTP/3 (requires http),
  hard to debug locally. Vercel uses H2 and Cloudflare Pages uses H3.
  Set this up yourself if you are self-hosting a Node.js server.

- **edge** deployment for proximity

### Improve FCP and LCP {#improve-fcp-and-lcp}

Techniques to improve FCP and LCP:

- **Optimize server response time**: reduce TTFB, use a CDN, cache
  assets, use a fast server

- **Optimize JavaScript**: defer non-critical JS, remove unused JS,
  minify JS, use code splitting

- **Optimize web fonts**: preload fonts, use font-display: swap, use
  system fonts

- **Optimize CSS**: inline critical CSS, preload non-critical CSS,
  minify CSS, remove unused CSS

- **Optimize images**: use the right format, compress images, use lazy
  loading, use responsive images

## CLS (Cumulative Layout Shift) {#cls-cumulative-layout-shift}

A sum of all the layout shift scores. Individual layout shift score is
calculated by multiplying the impact fraction by the distance fraction.

    layout shift score = impact fraction * distance fraction

The **impact fraction** (pixels / viewport) measures how unstable
elements impact the viewport area between two frames, relative to the
viewport size.

The **distance fraction** (pixels / viewport) measures the distance
unstable elements themselves move into the viewport, relative to the
viewport size.

See https://web.dev/articles/cls#impact-fraction for the details of the
formula.

**Not all layout shifts are bad**. Layout shifts that occur in response
to user interactions (such as clicking or tapping a link, pressing a
button, or typing in a search box) are generally fine, as long as the
shift occurs close enough to the interaction that the relationship is
clear to the user.

Layout shifts that occur within 500 milliseconds after a user input will
have the `hadRecentInput` flag set, so they can be excluded from
calculations.

To provide a good user experience, sites should strive to have a CLS of
**0.1** or less for at least 75% of page visits.

### Improve CLS {#improve-cls}

- provide **layout hints**: set sizes for images and dynamically added
  elements

- **styling** solutions: `aspect-ratio` for images, fixed or absolute
  position dynamic elements

## INP (Interaction to Next Paint) {#inp-interaction-to-next-paint}

INP is a metric that assesses a page’s overall responsiveness to user
interactions by observing the latency of all click, tap, and keyboard
interactions that occur throughout the lifespan of a user’s visit to a
page. The final INP value is the longest interaction observed, ignoring
outliers.

The intent of INP is not to measure **all** the eventual effects of an
interaction (such as network fetches and UI updates from other
asynchronous operations) but the time that the next paint is being
blocked.

INP is calculated by observing all the interactions made with a page.
For most sites the interaction with the **worst** latency is reported as
INP.

An INP below **200ms** is considered good (higher than the usual 100ms
threshold).

### FID (First Input Delay) {#fid-first-input-delay}

A retired measure in favor of INP

FID measures the first INP.

## Optimize INP {#optimize-inp}

The delay can be divided into 3 stages

- The **input delay**, which starts when the user initiates an
  interaction with the page, and ends when the event callbacks for the
  interaction begin to run.

  Long input delay is usually caused by activity occurring on the main
  thread (perhaps due to scripts loading, parsing and compiling), fetch
  handling, timer functions, or even from other interactions that occur
  in quick succession and overlap with one another.

  Ways to optimize input delay include:

  - avoid recurring timers and long running tasks that blocks the main
    thread, more on this in how to optimize the processing duration
    later

  - reduce interaction overlay by introducing a debouncing mechanism and
    use `AbortController` to cancel congesting fetch requests

- The **processing duration**, which consists of the time it takes for
  event callbacks to run to completion.

  The best general advice in optimizing event callbacks is to do as
  little work as possible in them. But if we can’t avoid it, we can
  split the work into smaller tasks by **yielding** the main thread.
  Details of yielding in https://web.dev/articles/optimize-long-tasks.

  A classic example is perform the critical DOM update first, then
  schedule the rest of the work using `setTimeout` in the
  `requestAnimationFrame` callback. This way, the next paint happens
  quickly after the critical update, and the expensive work is finished
  in a later, separate task.

  ``` js
  textBox.addEventListener('input', (inputEvent) => {
    // Update the UI immediately, so the changes the user made
    // are visible as soon as the next frame is presented.
    updateTextBox(inputEvent);

    // Use `setTimeout` to defer all other work until at least the next
    // frame by queuing a task in a `requestAnimationFrame()` callback.
    requestAnimationFrame(() => {
      setTimeout(() => {
        const text = textBox.textContent;
        updateWordCount(text);
        checkSpelling(text);
        saveChanges(text);
      }, 0);
    });
  });
  ```

  Conceptually, this is similar to `startTransition` in React to
  schedule low-priority state updates.

  ![setTimeout breaks long
  tasks](https://web.dev/static/articles/optimize-inp/image/interaction-latency_1920.png)

- The **presentation delay**, which is the time it takes for the browser
  to present the next frame which contains the visual result of the
  interaction.

  Presentation delay could be a problem if the DOM tree is large, DOM
  can cause rendering updates to be very expensive, and therefore
  increase the time it takes for the browser to present the next frame.

  Use `content-visibility` to lazily render off-screen elements. Details
  in https://web.dev/articles/content-visibility

## Other Topics {#other-topics}

### `PeformanceObserver` {#peformanceobserver}

``` ts
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        console.log("Layout shift by", entry.value);
    }
});

observer.observe({
    type: "layout-shift",
    // queue the events that happened before the observer was created
    buffered: true
});
```

Use the `web-vitals` library to get the metrics

``` ts
import { onLCP, onINP, onCLS } from 'web-vitals';

onCLS(console.log);
onINP(console.log);
onLCP(console.log);
```

### Browser Support {#browser-support}

3 web vital metrics: LCP, CLS, INP

- Blink Engine supports all: Chrome, Edge, Opera

- Webkit supports none: Safari, Chrome on IOS, zero Safari user will
  send these metrics, though FCP and TTFB are available.

- Gecko only supports LCP: Firefox

### Legacy Metrics {#legacy-metrics}

Two legacy metrics are

- `DOMContentLoaded` event: fires when the HTML document has been
  completely parsed, and all deferred scripts are executed

- `load` event: all things in the `DOMContentLoaded` event, and
  resources such as images, fonts have been loaded

For SPA apps, these two events fire almost immediately, so they are not
useful for measuring performance. Note that although `DOMContentLoaded`
and `load` will wait for scripts to be executed, it won’t wait for the
actual async initialization of what the SPA script does.

``` html
<body>
    <div id="root"></div>

    <!-- This script tag blocks DOMContentLoaded -->
    <script src="bundle.js">
        // Inside bundle.js:
        console.log("Bundle loading");

        // This synchronous code blocks
        initializeFramework();

        // But async operations don't
        createApp().then(() => {
            console.log("App ready - happens after DOMContentLoaded!");
        });
    </script>

    <script>
        // This will fire after bundle.js fully loads and executes
        document.addEventListener('DOMContentLoaded', () => {
            console.log("DOMContentLoaded");
        });
    </script>
</body>
```

## Tools {#tools}

- [Speed
  Check](https://requestmetrics.com/resources/tools/crux/?origin=):
  query chrome UX report, find the web vitals for MDN, target.com, etc.

- [PageSpeed
  Insights](https://pagespeed.web.dev/analysis/https-qiushiyan-dev/pq16m14nqa?form_factor=desktop):
  run lighthouse report, but on google’s machines

- [Web Page Test](https://www.webpagetest.org/): starting a robot at a
  specific location and network condition
