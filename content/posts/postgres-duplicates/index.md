---
title: Working with Data Duplication in Postgres
slug: postgres-duplicates
date: '2024-11-02'
description: How to check, analyze and remove data duplication in Postgres
tags:
- Database
knitr:
  opts_chunk:
    collapse: true
    comment: '#'
draft: true
components:
- quiz-table-example
headings:
- title: Define Duplication
  slug: define-duplication
  depth: 2
- title: Check Duplication
  slug: check-duplication
  depth: 2
- title: Deduplication
  slug: deduplication
  depth: 2
- title: The Limitations of `SELECT DISTINCT`
  slug: the-limitations-of-select-distinct
  depth: 3
- title: '`DISTINCT ON` Clause'
  slug: distinct-on-clause
  depth: 3
---

## Define Duplication {#define-duplication}

In the context of relational databases, data duplication usually means
the existence of multiple records that have the same values in all
columns. It is implied that they are considered an anomaly and we want
to special case how we handle the duplicated records, such as adding a
flag, giving them less weights, or keeping only one row group.

However, the definition of duplication can vary depending on the domain.
If you are running an online survey, while a participant (identified by
IP addresses) can fill out the form multiple times, we might only want
to take into account their last submission. Then, all the previous
submissions should be considered as duplicates regardless of if the
answers are different.

In this post, we will consider a table for storing the quiz submissions
of students in a university class. Each row represents a submission
record for a student in a quiz, alongside with the score and the
submission date. A student may submit the same quiz multiple times.

## Check Duplication {#check-duplication}

<quiz-table-example></quiz-table-example>

``` sql
CREATE TABLE quiz_submissions (
   id INTEGER PRIMARY KEY,
   student_id INTEGER NOT NULL,
   quiz_id INTEGER NOT NULL,
   score INTEGER NOT NULL,
   date DATE NOT NULL
);

-- Output:  0 rows
```

## Deduplication {#deduplication}

### The Limitations of `SELECT DISTINCT` {#the-limitations-of-select-distinct}

`SELECT DISTINCT` is a query modifier that exists in most relational
databases which allows reducing rows if all columns are identical to the
columns of another row. Say we are running a university class and have a
table for storing the quiz submissions for each student.

If we want to know the unique student list that has submitted a quiz, we
write the following query:

``` sql
SELECT DISTINCT student_id
from quiz_submissions;

-- Output:  4 rows
| student_id|
|----------:|
|          3|
|          4|
|          2|
|          1|
```

How about the unique combinations of students and their scores? Just add
the `score` column to the column set:

``` sql
SELECT DISTINCT student_id, score
FROM quiz_submissions;

-- Output:  6 rows
| student_id| score|
|----------:|-----:|
|          2|    70|
|          1|    90|
|          2|    90|
|          3|   100|
|          4|    80|
|          1|    80|
```

Things get more complicated when we are de-duplicating rows within a
subset, instead of the entire table. For example, we want to get the
latest score of each student in each quiz. You will find it impossible
to fit this requirement into a single `SELECT DISTINCT` based statement.
Once you all 3 columns in `SELECT DISTINCT`, you will get all the rows
back.

This leads to a major downside of `SELECT DISTINCT` is that you must use
the same set of columns for both duplication checks and column
selection. So you can’t Get unique rows based on specific columns while
getting the associated data from other columns. For example,

Another problem of `SELECT DISTINCT` is that you are limited to using
the same column set to do both duplication checks and column selection.
For example, if we are asking the question “”

Postgres offers an additional `Distinct ON` clause that gives you more
flexibility.

### `DISTINCT ON` Clause {#distinct-on-clause}
