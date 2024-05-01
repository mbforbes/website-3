---
title: Hire me
hidedate: true
layout: "layouts/default.njk"
eleventyExcludeFromCollections: true
---

<style>
.slot {
    overflow: hidden;
    line-height: 1.2em;
    height: 1.2em;
    display: inline-block;
    margin-left: -6px;
    margin-right: -6px;
    transform: translateY(.3em);
}
.slot .slotItem {
    position: relative;
}
@keyframes scrollUp {
  0% {margin-top: 0em;}
  /* 50% {margin-top: -1.2em;} */
  100% {margin-top: -1.2em;}
}
.scrollMe {
    /* easeOutCirc */
    /* animation: scrollUp forwards cubic-bezier(0, 0.55, 0.45, 1); */
    /* builtin */
    /* animation: scrollUp forwards ease-in-out; */
    /* animation: scrollUp forwards linear; */
    /* easeInOutCirc */
    animation: scrollUp forwards cubic-bezier(0.85, 0, 0.15, 1);
}
</style>

<div class="sans-serif">
<div class="mb3">
<dl class="dib mr5 mv2">
    <dd class="f6 ml0 ">Availability</dd>
    <dd class="f3 b ml0">Limited</dd>
</dl>
<dl class="dib mr5 mv2">
    <dd class="f6 ml0 ">Updated</dd>
    <dd class="f3 b ml0">May 2024</dd>
</dl>
<dl class="dib mr5 mv2">
    <dd class="f6 ml0 ">Contact</dd>
    <dd class="f3 ml0 fw6 pl1" id="business-email" style="font-family: Monaspace Krypton;">
        enable JS plz
    </dd>
</dl>
</div>

<div class="mb5">
<div class="w2 h2 bg-orange br3 inline-flex v-btm mr2" style="padding: 0.3rem;">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FFF" class="" style="">
<path stroke-linecap="round" stroke-linejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5h6.75V15H4.5v-4.5ZM3.75 18h15A2.25 2.25 0 0 0 21 15.75v-6a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 1.5 9.75v6A2.25 2.25 0 0 0 3.75 18Z" />
</svg>
</div>
I currently have ~20 hours / month open consulting capacity.
<p class="f6 mt3 serif">One-time or recurring contracts. Flexible scheduling. Minimum 5 hours. Meetings EST working hours. My business is Least Significant Bit, LLC.</p>
</div>
</div>

I can help you with:

<p class="sans-serif b mt4 mb0">Natural language processing (NLP)</p>
<p class="mt0">{{ "I completed my PhD in NLP---see my [research](/research) for details---so I can offer expertise to nearly any NLP project. My research focused on grounded language, social commonsense reasoning, and evaluation. I'm passionate about teaching and communication." | md | safe }}</p>

<p class="sans-serif b mt4 mb0">General machine learning (ML) and artificial intelligence (AI)</p>
<p class="mt0">While my deepest knowledge is in NLP, I also worked in a robotics lab, and have published crossover work with computer vision. I'm broadly comfortable working on machine learning projects, from statistical methods to deep neural nets.</p>

<p class="sans-serif b mt4 mb0">Full stack development</p>
<p class="mt0">{{ "I'm a generalist programmer. At Google, I interned as a frontend engineer on Gmail, and later worked as a full-time backend engineer on Kubernetes / GKE. In a recent project ([Talk to Me Human](https://talktomehuman.com/)), I built the backend (Python + FastAPI), database integration, LLM prompting, and all aspects of the web frontend (HTML, CSS, TypeScript + React, animations and sounds)." | md | safe }}</p>

<script type="text/javascript" src="/assets/js/business-email.js" defer></script>
