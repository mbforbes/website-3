---
title: "Reducing creative friction: starting a new project"
date: 2021-08-22
---

I've written about [creative friction]({{ "/posts/creative-friction/" | url }}) before. But I just realized a new source: how much effort it takes to start a new project.

A few seemingly small things can inhibit the process way more than I realize. Here's some I realized recently, and the changes I've made.

friction | reduction
--- | ---
Having a bunch of code editors open | Just opening up one editor at the root of all of my git repositories (`~/repos/`). Surprisingly, VS Code can handle it. Unexpected benefit: now way easier to cross reference code and docs from other projects.
Starting new code repo locally + on GitHub | Downloaded GitHub command line tool and auth token, learned incantation: `gh repo create mbforbes/[name] -y -d "[desc]" --public/--private`
Starting new python project locally | [`,pynew`](https://github.com/mbforbes/dotfiles/blob/master/scripts/%2Cpynew)
Installing a new python package | [`,pyinstall`](https://github.com/mbforbes/dotfiles/blob/master/scripts/%2Cpyinstall)
Starting a new three.js project | Made repo with build script and template. Next: writing script so it's one line.
Starting a new p5.js project | Made repo with build script and template. Next: writing script so it's one line.

These are specific to programming projects. Here's an example for drawing: how likely are you to start a new drawing if:

1. your drawing equipment is all away in a closet?
2. your drawing equipment is near you but you have to get out paper and pick a tool?
2. you are currently drawing and just finished a sketch?
