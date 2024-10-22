---
title: Accessibility
slug: a11y-notes
date: '2024-10-20'
headings:
- title: Button
  slug: button
  depth: 2
- title: Feed
  slug: feed
  depth: 2
---

## Button {#button}

## Feed {#feed}

https://www.w3.org/WAI/ARIA/apg/patterns/feed/

A feed is a section where the contents are added based on the scroll
position.

- Scrolling container has `role="feed"`, has `aria-label` or
  `aria-labelledby`

- the `feed` element has `aria-busy=true` when elements are being added
  or removed, and `aria-busy=false` when the feed is stable

- Individual items are `article`, has `aria-label` or `aria-labelledby`

- Each `article` has `aria-posinset` and `aria-setsize` to indicate the
  position in the feed
