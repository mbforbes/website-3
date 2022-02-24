---
title: textmetrics
software_url: https://github.com/mbforbes/textmetrics
language: python
summary: "Run the original implementations of BLEU, ROUGE, and METEOR from within Python."
tags: research
---

If you try to run any of the standard machine text evaluation metrics, you discover a surprising world of pain. BLEU is a Perl script, METEOR is a Java program, ROUGE is a problematic Perl script, and they all have inconsistent interfaces and expectations. If you instead went with a Python reimplementation, you'd learn there were inconsistencies in preprocessing that change the resulting scores.
<br/><br/>
`textmetrics` was my stab at providing a consistent Python interface still that ran the original programs (e.g., BLUE in Perl, METEOR in Java) under the hood. I also included some additional metrics by computing various ngram statistics. When we were studying [neural text (de)generation](https://arxiv.org/pdf/1904.09751.pdf), we realized that the standard metrics only told us so much, and we drew from auxiliary sources to get a more holistic picture of what models were doing.
<br/><br/>
Today, I no longer think it's important to use the exact reference implementations (unless you're doing a shared task with standard script, of course). There is enough statistical noise from other sources that I don't think it's vital to exactly replicate the reference implementations' decisions. Instead, I would simply use the most widespread reimplementation in Python, perhaps the ones in [huggingface/datasets](https://github.com/huggingface/datasets).
