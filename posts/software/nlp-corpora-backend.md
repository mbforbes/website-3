---
title: nlp-corpora
software_url: https://github.com/mbforbes/nlp-corpora-backend
language: python
summary: Manage community-curated collections of NLP corpora.
tags: research
---

Our broader NLP group had struggled with collectively sharing corpora: who has what, where do we store it, how do we make sure it's unmodified, and how do we share any processed versions? I built this tool to help us solve these problems. It scans over a directory on a shared filesystem, performing checks on the structure and permissions of corpora, and uploads the results to a [browsable index](https://github.com/uwnlp/nlp-corpora). I have it run daily as a cron job. (This is also why it looks like I [commit every day](https://github.com/mbforbes) on GitHub.)
