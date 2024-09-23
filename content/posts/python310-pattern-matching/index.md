---
title: Structural Pattern Matching in Python 3.10
slug: python310-pattern-matching
date: '2022-02-20'
description: |
  The  _py`match case`_  statement for pattern matching is an exciting new feature added in Python 3.10. This article reviews the syntax and shows some practical examples.
tags:
- Python
headings:
- title: Introduction
  slug: introduction
  depth: 2
- title: Pattern Matching as a Replacement for `switch` Statements
  slug: pattern-matching-as-a-replacement-for-switch-statements
  depth: 2
- title: Match Against Dictionaries and Lists
  slug: match-against-dictionaries-and-lists
  depth: 2
- title: Add Conditions
  slug: add-conditions
  depth: 2
- title: Matching Against Constants
  slug: matching-against-constants
  depth: 2
---

## Introduction {#introduction}

[Structural Pattern Matching](https://www.python.org/dev/peps/pep-0634/)
is a new feature introduced in python
[3.10](https://docs.python.org/3/whatsnew/3.10.html), and perhaps the
most intriguing one. It takes as input an object to inspect (following
*py`match`*), and multiple patterns to match against (following one or
more *py`case`*). If there is a match, a pattern-specific code block
runs. The basic syntax is

<!-- ```{r, include = FALSE}
ymisc::set_knitr_options()
library(reticulate)
Sys.setenv(RETICULATE_PYTHON = "/opt/homebrew/Cellar/python@3.10/3.10.5/bin/python3")
``` -->

``` python
error_code = 403
match error_code:
    case 400:
        print("Bad request")
    case 403:
        print("Unauthorized")
    case 500:
        print("Internal server error")
# !callout[/case _/] the default case when none of the above matches :right
    case _:
        print("Something's wrong with the Internet")
#> Unauthorized
```

Here, we check case by case if `error_code` is equal to a value, if it’s
not one of `400`, `403`, `500`, `_` will be a catch-all wildcard. Also,
pattern matching will break when it hits a match, so each `case` should
be independent.

To run examples in this article, be sure you are using python higher
than 3.10.

``` python
import sys
sys.version
#> '3.10.14 (main, Mar 19 2024, 21:46:16) [Clang 15.0.0 (clang-1500.3.9.4)]'
```

## Pattern Matching as a Replacement for `switch` Statements {#pattern-matching-as-a-replacement-for-switch-statements}

The most apparent usage of pattern matching is implementing
`switch ... case` statements in many other programming languages, which
is a replacement for multiple if else statements. Imagine we are
building a game, and we have a `move` function for controlling figure
movement.

``` python
def move(self, direction):
    match direction:
        case "up":
            self.move_up()
        case "down":
            self.move_down()
        case "left":
            self.move_left()
        case "right":
            self.move_right()
```

## Match Against Dictionaries and Lists {#match-against-dictionaries-and-lists}

The real power of pattern matching resides in destructuring data
structures like lists and dictionaries.

``` python
match {"first_name": "Jane", "last_name": "Doe", "middle_name": ""}:
    case {"first_name": first_name , "last_name": last_name}:
        print(first_name, last_name)
#> Jane Doe
```

In the example above, we supplied a pattern that says the object should
contains keys “first_name” and “last_name”, if the pattern matches,
their values will be captured into the variables `first_name` and
`last_name`. Note that for an dictionary, structural pattern matching
matches the structure instead of the exact content, the pattern is valid
as long as “first_name” and “last_name” are one of the object’s keys,
any unmentioned keys, like “middle_name”, will be ignored.

For a more advanced example, suppose we are working with the [SpaceX
API](https://docs.spacexdata.com/) to retrieve launch data, an
individual record of launch looks like

``` json
{
        "flight_number": 1,
        "mission_name": "FalconSat",
        "upcoming": false,
        "launch_year": "2006",
        "launch_date_unix": 1143239400,
        "rocket": {
            "rocket_id": "falcon1",
            "rocket_name": "Falcon 1",
        },
        "details": "Engine failure at 33 seconds and loss of vehicle",
        //... other fields
}
```

We only want to get the fields `mission_name`, `rocket_name` and
`details`. Note that

``` python
import requests
import json
import pprint
res = requests.get("https://api.spacexdata.com/v3/launches?limit=3")
data = res.json()
out = []
for launch in data:
    match launch:
        case {"mission_name": mname, "rocket": {"rocket_name": rname}, "details": details}:
            out.append({"mission_name": mname, "rocket_name": rname, "details": details})

print(json.dumps(out, indent = 2))
```

``` json
[
  {
    "mission_name": "FalconSat",
    "rocket_name": "Falcon 1",
    "details": "Engine failure at 33 seconds and loss of vehicle"
  },
  {
    "mission_name": "DemoSat",
    "rocket_name": "Falcon 1",
    "details": "Successful first stage burn and transition to second stage, maximum altitude 289 km, Premature engine shutdown at T+7 min 30 s, Failed to reach orbit, Failed to recover first stage"
  },
  {
    "mission_name": "Trailblazer",
    "rocket_name": "Falcon 1",
    "details": "Residual stage 1 thrust led to collision between stage 1 and stage 2"
  }
]
```

Here, not only are we matching top level key `mission_name` and
`details`, we also use a nested pattern to extract rocket name.

You can also match on a list.

``` python
match [1, 2, 3]:
    case [1, 2]:
        print("match 1")
# !callout[/\*rest/] match the the rest of elements
    case [2, *rest]:
        print("match 2")
        print(rest)
# !callout[/\*other/] match elements except the last one
    case[*other, last]:
        print("match 3")
        print(last)
        print(other)
#> match 3
#> 3
#> [1, 2]
```

I mentioned that pattern matching for dict does not require use to
explicitly declare all fields. For lists this is different, we have to
declare all elements, this is why match 1 fails. Match 2 attempts to use
the `*` syntax to capture all values after 2 into a list called `rest`.
This is helpful in case the list is really large and it’s impossible to
exhaust all elements, or we simply don’t care about some elements.
However, the second pattern does not specify the correct order, as 2 is
not the first element in the matching object. Match 3 captures all
elements but the last into `other`, and assign the last element to
`last`.

It’s also possible to express `or` logic with `|` in case statement. For
example, we may add a `case 401 | 403 | 404: "Not allowed"` statement to
our first example. Here is another example from pep:

``` python
match command.split():
    ... # Other cases
    case ["north"] | ["go", "north"]:
        current_room = current_room.neighbor("north")
    case ["get", obj] | ["pick", "up", obj] | ["pick", obj, "up"]:
        ... # Code for picking up the given object
```

Literal patterns can also be captured using the `as` keyword

``` python
match command.split():
    case ["go", ("north" | "south" | "east" | "west") as direction]:
        current_room = current_room.neighbor(direction)
```

## Add Conditions {#add-conditions}

Pattern matching allows if conditions the same way as list
comprehension, we can append an *py`if ... else`* clause like so

``` python
all_directions = ["up", "down"]

match commad.split():
    case ["go", direction] if direction in all_directions:
        move(direction)
    case ["go", _]:
        print("direction not supported")
```

For conditions that checks if an object is of a data type, we can
directly use the class creator function:

``` python
def sum_list(numbers):
    match numbers:
        case []:
            return 0
        case [int(first) | float(first), *rest]:
            return first + sum_list(rest)
        case _:
            raise ValueError(f"Can only sum lists of numbers")

sum_list([1, 2, 3])
#> 6
sum_list([1, "2", 3])
#> Can only sum lists of numbers
```

Here *py`int(first) | float(first)`* checks if the first element is an
integer or float. The next example uses a `dataclass` based pattern as
well as its attributes

``` python
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

p = Point(x = 1, y = 1)
# data class for validation
match p:
    case Point(x = x):
        print(x)
#> 1
```

In general, any class can be used for validation. This is also called a
**class pattern**.

## Matching Against Constants {#matching-against-constants}

Care should be taken when matching constants, since it’s common to store
the constant in an variable and then use it in `case`. The following
code will not work:

``` python
direction = "up"

match "down":
# !callout[/direction/] capture "up" into the variable `direction` :right
    case direction:
        print("match")
    case _:
        print("no match")
```

We are trying to match the value “up”, but python interprets it as a
capture pattern that says store whatever the match object is into the
variable `direction`, so we are effectively overriding `direction`
(recall the list matching example) and the first case always matches.
Python will not allow this with an error message
`SyntaxError: name capture 'direction' makes remaining patterns unreachable`.

As an alternative to matching literal values, we can use an enum type
for constant matching instead

``` python
import enum
class Direction(str, enum.Enum):
    up = "up"
    down = "down"

match "down":
    case Direction.up:
        print("match 1")
    case Direction.down:
        print("match 2")
    case _:
        print("match 3")
#> match 2
```
