---
title: Research
subtitle: This is my academic webpage
hidedate: true
layout: "layouts/default.njk"
---

<img width="200" src="{{ "/assets/img/max.jpg" | url }}" style="float: right; margin: 25px;">

## Bio

I received my PhD in computer science from the University of Washington. I was advised by [Yejin Choi](https://homes.cs.washington.edu/~yejin/). My primary field of study is natural language processing (NLP).

I'm interested in NLP where the rubber meets the road: language and stuff like robotics, vision, physical commonsense, and social norms. Rather than "language and X," I think of it as "X, but sometimes we also use language." In other words, language as a messy artifact of a messy world.

I was a 2016 NSF Graduate Research Fellow. In 2018--2019, I was a student researcher at
Google AI, working with [Christine Kaeser-Chen](https://twitter.com/kaeserchen) and
[Serge Belongie](http://blogs.cornell.edu/techfaculty/serge-belongie/).
I was regularly a research intern at the Allen Institute for AI.

Before jumping fully into NLP, I worked on robotics and robotics+NLP, with [Raj Rao](https://www.rajeshpnrao.com/), [Maya Cakmak](https://homes.cs.washington.edu/~mcakmak/), and [Luke Zettlemoyer](https://www.cs.washington.edu/people/faculty/lsz), from about 2012--2015. From 2014--2015, I spent a year as a full time software engineer at Google, working on the [now-infamous](https://k8s.af/) datacenter operating system called [Kubernetes](https://kubernetes.io/) (and [GKE](https://cloud.google.com/kubernetes-engine)).

Contact me at: <img height="22" class="inline" src="{{ "/assets/img/my-email.png" | url }}">

## Mentoring

I am lucky to have collaborated with some amazing undergraduate students during my PhD: [Yao Dou](https://yao-dou.github.io/), [Jeff Da](https://jeffda.com/), and [Pooja Sethi](https://poojasethi.github.io/).

I am eternally grateful to the wonderful graduate students who mentored me when I was an
undergraduate (and beyond): [Mike Chung](https://homes.cs.washington.edu/~mjyc/),
[Kenton Lee](http://kentonl.com/) and [Yoav Artzi](https://yoavartzi.com/).

## Notes

<ul class="list pa0">
{% for post in collections.research | rejectAttrContains(["data", "tags"], "software") | sort(true, false, "date") %}
<li class="mv2">
<a href="{{ post.url }}" class="db pv1 link">
<time class="fr silver ttu ml3">{{ post.date | readableDate }} </time>
{{ post.data.title }}
</a>
</li>
{% endfor %}
</ul>

## Software

{% include "programming-language-tooltips.njk" %}

{% set software = collections.software | selectAttrContains(["data", "tags"], "research") | rejectAttrNested(["data", "omit"]) %}
{% for item in software %}
{%- include "software-long.njk" -%}
{% endfor %}

## Publications

[**Scarecrow: A Framework for Scrutinizing Machine Text**](https://arxiv.org/pdf/2107.01294.pdf)<br/>
Yao Dou&#42;, **Maxwell Forbes**&#42;, Rik Koncel-Kedziorski, Noah A. Smith, Yejin Choi<br/>
_Association for Computational Linguistics (ACL) 2022_<br/>
[[project](https://yao-dou.github.io/scarecrow/)] [[bib]({{ "/assets/research/dou2021scarecrow.bib" | url }})]

<p style="height: 1px;"></p>

[**Delphi: Towards Machine Ethics and Norms**](https://arxiv.org/pdf/2110.07574.pdf)<br/>
Liwei Jiang, Jena D. Hwang, Chandra Bhagavatula, Ronan Le Bras, **Maxwell Forbes**, Jon Borchardt, Jenny Liang, Oren Etzioni, Maarten Sap, Yejin Choi<br/>
_arXiv, 2021_<br/>
[[demo](https://delphi.allenai.org/)] [[bib]({{ "/assets/research/jiang2021delphi.bib" | url }})]

<p style="height: 1px;"></p>

[**CLIPScore: A Reference-free Evaluation Metric for Image Captioning**](https://arxiv.org/pdf/2104.08718.pdf)<br/>
Jack Hessel, Ari Holtzman, **Maxwell Forbes**, Ronan Le Bras, Yejin Choi<br/>
_Empirical Methods in Natural Language Processing (EMNLP) 2021_<br/>
[[bib]({{ "/assets/research/hessel2021clipscore.bib" | url }})]

<p style="height: 1px;"></p>

[**Moral Stories: Situated Reasoning about Norms, Intents, Actions, and their Consequences**](https://arxiv.org/pdf/2012.15738.pdf)<br/>
Denis Emelin, Ronan Le Bras, Jena D. Hwang, **Maxwell Forbes**, Yejin Choi<br/>
_Empirical Methods in Natural Language Processing (EMNLP) 2021_<br/>
[[data &amp; code](https://github.com/demelin/moral_stories)]

<p style="height: 1px;"></p>

[**Edited Media Understanding Frames: Reasoning About the Intent and Implications of Visual Misinformation**](https://aclanthology.org/2021.acl-long.158.pdf)<br/>
Jeff Da, **Maxwell Forbes**, Rowan Zellers, Anthony Zheng, Jena D. Hwang, Antoine Bosselut, Yejin Choi<br/>
_Association for Computational Linguistics (ACL) 2021_<br/>
[[project](https://jeffda.com/edited-media-understanding)] [[bib]({{ "/assets/research/da2021edited.bib" | url }})]

<p style="height: 1px;"></p>

[**MultiTalk: A Highly-Branching Dialog Testbed for Diverse Conversations**](https://arxiv.org/pdf/2102.01263.pdf)<br/>
Yao Dou, **Maxwell Forbes**, Ari Holtzman, Yejin Choi<br/>
_Association for the Advancement of Artificial Intelligence (AAAI) 2021_<br/>
[[data](https://uwnlp.github.io/multitalk/)] [[bib]({{ "/assets/research/dou2021multitalk.bib" | url }})]

<p style="height: 1px;"></p>

[**Paragraph-Level Commonsense Transformers with Recurrent Memory**](https://arxiv.org/pdf/2010.01486.pdf)<br/>
Saadia Gabriel, Chandra Bhagavatula, Vered Shwartz, Ronan Le Bras, **Maxwell Forbes**, Yejin Choi<br/>
_Association for the Advancement of Artificial Intelligence (AAAI) 2021_<br/>
[[data &amp; code](https://github.com/skgabriel/paracomet)] [[bib]({{ "/assets/research/gabriel2021paragraph.bib" | url }})]

<p style="height: 1px;"></p>

[**Social Chemistry 101: Learning to Reason about Social and Moral Norms**](https://arxiv.org/pdf/2011.00620.pdf)<br/>
**Maxwell Forbes**, Jena D. Hwang, Vered Shwartz, Maarten Sap, Yejin Choi<br/>
_Empirical Methods in Natural Language Processing (EMNLP) 2020_<br/>
[[project page](https://maxwellforbes.com/social-chemistry/): [demo](https://maxwellforbes.com/social-chemistry/#demo), [data browser](https://maxwellforbes.com/social-chemistry/#dataset-browser)] [[data](https://storage.googleapis.com/ai2-mosaic-public/projects/social-chemistry/data/social-chem-101.zip)] [[code](https://github.com/mbforbes/social-chemistry-101)] [[video](https://slideslive.com/38939338/social-chemistry-101-learning-to-reason-about-social-and-moral-norms)] [[bib]({{ "/assets/research/forbes2020social.bib" | url }})]

<p style="height: 1px;"></p>

[**Thinking Like a Skeptic: Defeasible Inference in Natural Language**](https://www.aclweb.org/anthology/2020.findings-emnlp.418.pdf)<br/>
Rachel Rudinger, Vered Shwartz, Jena D. Hwang, Chandra Bhagavatula, **Maxwell Forbes**, Ronan Le Bras, Noah A. Smith, Yejin Choi<br/>
_Findings of Empirical Methods in Natural Language Processing (Findings of EMNLP) 2020_<br/>
[[bib]({{ "/assets/research/rudinger2020thinking.bib" | url }})]

<p style="height: 1px;"></p>

[**The Curious Case of Neural Text <i>De</i>generation**](https://arxiv.org/pdf/1904.09751.pdf)<br/>
Ari Holtzman, Jan Buys, Li Du, **Maxwell Forbes**, Yejin Choi<br/>
_International Conference on Learning Representations (ICLR), 2020_<br/>
[[demo](http://neuraldegen.com/)] [[bib]({{ "/assets/research/holtzman2019curious.bib" | url }})]

<p style="height: 1px;"></p>


[**Neural Naturalist: Generating Fine-Grained Image Comparisons**](https://arxiv.org/pdf/1909.04101.pdf)<br/>
**Maxwell Forbes**, Christine Kaeser-Chen, Piyush Sharma, Serge Belongie<br/>
_Empirical Methods in Natural Language Processing (EMNLP) 2019_<br/>
[[project](https://mbforbes.github.io/neural-naturalist/)] [[data](https://github.com/google-research-datasets/birds-to-words)] [[video](https://vimeo.com/434276978)] [[bib]({{ "/assets/research/forbes2019neural.bib" | url }})]

<p style="height: 1px;"></p>

[**Do Neural Language Representations Learn Physical Commonsense?**](https://arxiv.org/pdf/1908.02899.pdf)<br/>
**Maxwell Forbes**, Ari Holtzman, Yejin Choi<br/>
_Conference of the Cognitive Science Society (CogSci) 2019_<br/>
[[project](https://mbforbes.github.io/physical-commonsense/)] [[code](https://github.com/mbforbes/physical-commonsense)] [[data](https://github.com/mbforbes/physical-commonsense/tree/master/data/pc)] [[poster](https://mbforbes.github.io/physical-commonsense/img/cogsci19-poster.pdf)]

<p style="height: 1px;"></p>

[**Learning to Write with Cooperative Discriminators**](https://arxiv.org/pdf/1805.06087.pdf)<br/>
Ari Holtzman, Jan Buys, **Maxwell Forbes**, Antoine Bosselut, David Golub, Yejin Choi<br/>
_Association for Computational Linguistics (ACL) 2018_<br/>
[[code](https://github.com/ari-holtzman/l2w)] [[demo](https://ari-holtzman.github.io/l2w-demo/)]

<p style="height: 1px;"></p>

[**Verb Physics: Relative Physical Knowledge of Actions and Objects**](https://arxiv.org/pdf/1706.03799.pdf)<br />
**Maxwell Forbes**, Yejin Choi<br />
_Association for Computational Linguistics (ACL) 2017_<br />
[[project](https://uwnlp.github.io/verbphysics/)] [[code](https://github.com/uwnlp/verbphysics)] [[data](https://github.com/uwnlp/verbphysics#data)] [[video](https://vimeo.com/234954495)]  [[slides]({{ "/assets/research/forbes2017verb-slides.pdf" | url }})] [[bib]({{ "/assets/research/forbes2017verb.bib" | url }})]

<p style="height: 1px;"></p>

[**Robot Programming by Demonstration with Situated Spatial Language Understanding**]({{ "/assets/research/forbes2015robot.pdf" | url }})<br />
**Maxwell Forbes**, Rajesh P. N. Rao, Luke Zettlemoyer, Maya Cakmak<br />
_IEEE International Conference on Robotics and Automation (ICRA) 2015_<br/>
[[video](https://www.youtube.com/watch?v=uPE-eGqVP3c)] [[code](https://github.com/mbforbes/hfpbd-parser)]

<p style="height: 1px;"></p>

[**Robot Programming by Demonstration with Crowdsourced Action Fixes**]({{ "/assets/research/forbes2014robot.pdf" | url }})<br />
**Maxwell Forbes**, Michael Jae-Yoon Chung, Maya Cakmak, Rajesh P. N. Rao<br />
_AAAI Conference on Human Computation and Crowdsourcing (HCOMP) 2014_<br />
[[slides]({{ "/assets/research/forbes2014robot-slides.pdf" | url }})]

<p style="height: 1px;"></p>

[**Accelerating Imitation Learning through Crowdsourcing**]({{ "/assets/research/chung2014accelerating.pdf" | url }})<br />
Michael Jae-Yoon Chung, **Maxwell Forbes**, Maya Cakmak, Rajesh P. N. Rao<br/>
_IEEE International Conference on Robotics and Automation (ICRA) 2014_<br />
[[press: Popular Science](https://www.popsci.com/article/technology/robot-learns-asking-strangers-internet)] [[press: IEEE Spectrum](https://spectrum.ieee.org/automaton/robotics/artificial-intelligence/please-tell-this-robot-what-a-turtle-looks-like)]

### Workshop papers

[**Programming by Demonstration with Situated Semantic Parsing**]({{ "/assets/research/artzi2014programming.pdf" | url }})<br />
Yoav Artzi&#42;, **Maxwell Forbes**&#42;, Kenton Lee&#42;, Maya Cakmak<br />
_AAAI Fall Symposium Series on Human-Robot Interaction 2014_<br/>
[[slides]({{ "/assets/research/artzi2014programming-slides.pdf" | url }})]

<p style="height: 1px;"></p>

[**Grounding Antonym Adjective Pairs through Interaction**]({{ "/assets/research/forbes2014grounding.pdf" | url }})<br/>
**Maxwell Forbes**, Michael Chung, Maya Cakmak, Luke Zettlemoyer, Rajesh P. N. Rao<br />
_ACM/IEEE International Conference on Human-Robot Interaction (HRI) Workshop on Asymmetric Interactions 2014_<br/>
[[slides]({{ "/assets/research/forbes2014grounding-slides.pdf" | url }})]
