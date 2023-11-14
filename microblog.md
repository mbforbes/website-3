---
title: µblog
hidedate: true
layout: "layouts/default.njk"
---

{% for post in collections.microblog | sort(true, false, "date") %}

<div class="microblogpost pv5">
    <p class="f6 lightest-text-color ttu sans-serif">
        {{ post.date | readableDate }}
        <a name="{{ post.data.title }}"></a>
    </p>
    <p class="f5 f4-ns">{{- post.templateContent | safe  -}}</p>
</div>

{% endfor %}
