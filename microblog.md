---
title: µblog
hidedate: true
layout: "layouts/default.njk"
---

{% for post in collections.microblog | sort(true, false, "date") %}
<div class="microblogpost pv5">
    <p class="f6 f5-ns lightest-text-color">
        {{ post.date | readableDate }}
    </p>
    <p class="f5 f4-ns">{{- post.templateContent  | replace("<p>", "") | replace("</p>", "") | safe  -}}</p>
</div>

{% endfor %}
