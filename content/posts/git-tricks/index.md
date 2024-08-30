---
title: "Git tricks"
date: 2024-07-23
draft: true
description: |
  Useful git tricks that simplifies daily commit workflows
---

https://www.youtube.com/watch?v=e6ZI6AmlHN4

## Reverting changes with `reset` and `restore`

https://stackoverflow.com/questions/58003030/what-is-git-restore-and-how-is-it-different-from-git-reset

## Filters

https://git-scm.com/book/en/v2/Customizing-Git-Git-Attributes

## Fixup commits

https://thoughtbot.com/blog/autosquashing-git-commits

```bash
git commit --fixup=<commit>
git rebase --autosquash
```

## Scalar

```bash
scalar clone <larg-repo>
```

## Worktrees

work in a branch in a separate directory

```bash
git worktree add -b bugfix ../another-directory
```

https://git-scm.com/docs/git-worktree
