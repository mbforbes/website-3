---
title: Stupid things I do constantly in Python
subtitle: A non-exhaustive list
date: 2021-07-30
---

- Output a string with `"{value}"`, run the whole thing again and make it `f"{value}"`.

- Misspell a command line argument when accessing it on an `args` object because it's beyond mypy's capabilities to type check.

- Try to access a `pandas` `DataFrame` by row like `df[0]` and have the same eighteen-line double stack trace vomited at me.

- Wait for minutes for `df.iterrows()` to iterate over a `pandas` `DataFrame` because I don't want to try to figure out the incantation for how to vectorize yet another trivial aggregation.

- Throw in `code.interact(local=dict(globals(), **locals()))` and `try`/`except` rather than learning how to use the python debugger or get break points to do something in my editor.

- Spend way too long playing type golf with stuff like `Dict[str, Dict[str, List[Optional[Union[float, int]]]]]` in one-off scripts to appease `mypy`.

- Spend way too long trying to correctly use `Enum`s for anything before going back to strings.

- Spend way too long trying to correctly configure `logging` for anything before going back to `print()`.
