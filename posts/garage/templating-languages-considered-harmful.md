---
title: Templating Languages Considered Harmful
date: 2023-03-05
# tags: TBD
# image: TBD
---

{% import "cards.njk" as cards %}
{{ cards.ideas() }}

I.e., frontend templating languages like Liquid and Nunjucks.

Can't set attribute on object
- https://github.com/mozilla/nunjucks/issues/636
- https://github.com/mozilla/nunjucks/issues/313

- Errors from wrong file location, or even wrong file

e.g., I've learned that when I see an error in my programming languages tooltips file, it's actually somewhere else.

```
[11ty] Problem writing Eleventy templates: (more in DEBUG output)
[11ty] > Having trouble rendering njk template ./studio.njk

`TemplateContentRenderError` was thrown
[11ty] > (./studio.njk)
  Template render error: (/Users/max/repos/website-3/_includes/programming-language-tooltips.njk) [Line 113, Column 21]
  attempted to output null or undefined value

`Template render error` was thrown:
[11ty]     Template render error: (./studio.njk)
      Template render error: (/Users/max/repos/website-3/_includes/programming-language-tooltips.njk) [Line 113, Column 21]
      attempted to output null or undefined value
        at Object._prettifyError (/Users/max/repos/website-3/node_modules/nunjucks/src/lib.js:36:11)
        at /Users/max/repos/website-3/node_modules/nunjucks/src/environment.js:563:19
        at eval (eval at _compile (/Users/max/repos/website-3/node_modules/nunjucks/src/environment.js:633:18), <anonymous>:140:12)
        at /Users/max/repos/website-3/node_modules/nunjucks/src/environment.js:571:11
        at Template.root [as rootRenderFunc] (eval at _compile (/Users/max/repos/website-3/node_modules/nunjucks/src/environment.js:633:18), <anonymous>:23:3)
        at Template.render (/Users/max/repos/website-3/node_modules/nunjucks/src/environment.js:552:10)
        at eval (eval at _compile (/Users/max/repos/website-3/node_modules/nunjucks/src/environment.js:633:18), <anonymous>:139:10)
        at fn (/Users/max/repos/website-3/node_modules/a-sync-waterfall/index.js:26:24)
        at /Users/max/repos/website-3/node_modules/a-sync-waterfall/index.js:66:22
        at executeSync (/Users/max/repos/website-3/node_modules/a-sync-waterfall/index.js:8:15)
[11ty] Copied 39 files / Wrote 0 files in 0.94 seconds (v1.0.0)
```

e.g., what this really means is that i forgot to put sufficient frontmatter (a title) in a new post. (actually, the one i'm writing right now.) programming-language-tooltips.nj doesn't require the title.

- Hard to do normal programming things:
    - Find out what variables are available
    - Find out what their values are
    - Debug
    - Even see that errors are happening (e.g., nunjucks error in eleventy, nothing printed)

- New, custom syntax for basic things
  - The attr accessor one

- Nunjucks may be the best (?) but it lacks basic documentation for builtin operations
  - TODO: find

- ... and it's abandoned
  - TODO: find

Consistently the biggest barrier to working on every iteration of my website. I'm glad that at least with Eleventy, if I really need to, I can do a bunch of crap in JavaScript and just pipe data structures into Nunjucks. (Though even that can be rough to use.)
