---
title: pr2_pbd
software_url: https://github.com/mbforbes/pr2_pbd
language: python
summary: My code for the PR2 robot, focusing on programming by demonstration (PbD) systems, spanning several projects.
tags: research
---

The readme has an index of the branches containing the directions I took this code base. One research project lives in the `hands-free` branch, which is the robotics portion of the code for the ICRA 2015 paper, _[Robot Programming by Demonstration with Situated Spatial Language Understanding](/data/research/forbes2015robot.pdf)_. A large collection of branches (`da`, `generate-objects`, `interface-video`, `mock-objects`, `mock-objects-http`, `mock-objects-pr2`, `success-testing`, `success-testing-pr2`) were involved in the HCOMP 2014 paper, _[Robot Programming by Demonstration with Crowdsourced Action Fixes](/data/research/forbes2014robot.pdf)_.
<br/><br/>
Looking back, it's wild to remember how challenging it is to build high level robotics software. Of course there's the robot itself, which can fail in myriad hilarious ways. But there's also the massive, ever-shifting, ever-slightly-failing robotics software stack you must build on top of, including partially working components, quirks, edge cases, and general sluggishness.
