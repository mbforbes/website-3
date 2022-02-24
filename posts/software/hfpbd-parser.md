---
title: hfpbd-parser
software_url: https://github.com/mbforbes/hfpbd-parser
language: python
summary: A simple command parser for hands-free robotics programming by demonstration (HFPbD).
tags: research
---

This is the NLP backend for our ICRA 2015 paper, _[Robot Programming by Demonstration with Situated Spatial Language Understanding](http://localhost:4000/data/research/forbes2015robot.pdf)_.
<br/><br/>
I think it's a great experience to write a rule-based parser. You quickly learn how exhausting it is to support a wide variety of language, and how brittle the resulting system is. But it's also fun to use, because you kind of make your own formal, constrained language (i.e., stuff that works for your parser) that you know how to use.
<br/><br/>
The cool part of this is that, unlike all of my "actual" NLP research projects after, this one actually _worked_ in the real world. I could type in commands, or talk to it with voice recognition, then it would parse my commands, send the commands to the robot, and the robot would plan and execute them. You could walk up to the robot and write a simple program for it using your voice, and the robot would actually manipulate objects as a result.
