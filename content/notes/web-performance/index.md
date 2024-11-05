---
title: Web Performance
slug: web-performance
date: '2024-10-31'
category: Web Development
headings:
- title: LCP (Largest Contentful Paint)
  slug: lcp-largest-contentful-paint
  depth: 2
- title: First Contentful Paint
  slug: first-contentful-paint
  depth: 3
- title: CLS (Cumulative Layout Shift)
  slug: cls-cumulative-layout-shift
  depth: 2
- title: INP (Interaction to Next Paint)
  slug: inp-interaction-to-next-paint
  depth: 2
- title: FID (First Input Delay)
  slug: fid-first-input-delay
  depth: 3
- title: Other Metrics
  slug: other-metrics
  depth: 2
- title: Time to First Byte (TTFB)
  slug: time-to-first-byte-ttfb
  depth: 3
- title: '`PeformanceObserver`'
  slug: peformanceobserver
  depth: 2
- title: Legacy Metrics
  slug: legacy-metrics
  depth: 3
- title: Browser Support
  slug: browser-support
  depth: 2
---

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
(including background images), <svg> elements, or non-white
<canvas>

elements.

To provide a good user experience, sites should strive to have a First
Contentful Paint of **1.8** seconds or less.

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

## Other Metrics {#other-metrics}

### Time to First Byte (TTFB) {#time-to-first-byte-ttfb}

TTFB is a metric that measures the time between the request for a
resource and when the first byte of a response begins to arrive.

This is measuring the performance for the server, and is generally not
related to client-side performance.

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

## `PeformanceObserver` {#peformanceobserver}

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

### Legacy Metrics {#legacy-metrics}

Two legacy metrics are

- `DOMContentLoaded` event: fires when the HTML document has been
  completely parsed, and all deferred scripts

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

## Browser Support {#browser-support}

3 web vital metrics: LCP, CLS, INP

- Blink Engine supports all: Chrome, Edge, Opera

- Webkit supports none: Safari, Chrome on IOS, zero Safari user will
  send these metrics, though FCP and TTFB are available.

- Gecko only supports LCP: Firefox