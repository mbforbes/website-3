---
title: Summer 2021 website goals
date: 2021-07-15
---

<style>
/* general */
progress {
    border: none;
}
progress::-webkit-progress-bar {
    background-color: #efefef;
    border-radius: .5rem;
}
progress::-webkit-progress-value {
    /* border-top-left-radius: .5rem; */
    /* border-bottom-left-radius: .5rem; */
    border-radius: .5rem;
}
progress::-moz-progress-bar {
    /* border-top-left-radius: .5rem; */
    /* border-bottom-left-radius: .5rem; */
    border-radius: .5rem;
}


/* time */
progress#time::-webkit-progress-value {
    background-color: #FF4136;
}
progress#time::-moz-progress-bar {
    background-color: #FF4136;
}

/* milestone */
progress#milestone::-webkit-progress-value {
    background-color: #19A974;
}
progress#milestone::-moz-progress-bar {
    background-color: #19A974;
}

/* "new (posts) */
progress#new::-webkit-progress-value {
    background-color: #FFD700;
}
progress#new::-moz-progress-bar {
    background-color: #FFD700;
}

/* series */
progress#series::-webkit-progress-value {
    background-color: #D5008F;
}
progress#series::-moz-progress-bar {
    background-color: #D5008F;
}

/* revisions */
progress#revision::-webkit-progress-value {
    background-color: #FF6300;
}
progress#revision::-moz-progress-bar {
    background-color: #FF6300;
}

/* "cleanup" (+ features) */
progress#cleanup::-webkit-progress-value {
    background-color: #357EDD;
}
progress#cleanup::-moz-progress-bar {
    background-color: #357EDD;
}

</style>

<p class="mb0 ttu b black-70">Time elapsed</p>

<progress id="time" value="0" max="1" class="w-100 h2 br3">
</progress>

<div class="cf">
<p class="fl black-40 ttu mt0 f6 f5-ns b">jul 14</p>
<p class="fr black-40 ttu mt0 f6 f5-ns b"><span id="time-cur" class="red"></span>/oct 1</p>
</div>

<p class="mt1 mb0 ttu b black-70">Overall progress</p>

<progress id="milestone" value="0" max="1" class="w-100 h2 br3">
</progress>
<p class="fr black-40 ttu mt0 f6 f5-ns b"><span id="milestone-cur" class="green"></span>/<span id="milestone-total">???</span></p>

<br/>

### Components

<p class="mb0 b black-70">Posts</p>
<progress id="new" value="0" max="1" class="w-100 h1 br3">
</progress>
<p class="fr black-40 ttu mt0 f6 f5-ns b"><span id="new-cur" class="yellow"></span>/<span id="new-total">???</span></p>

<p class="mb0 b black-70">Series</p>
<progress id="series" value="0" max="1" class="w-100 h1 br3">
</progress>
<p class="fr black-40 ttu mt0 f6 f5-ns b"><span id="series-cur" class="dark-pink"></span>/<span id="series-total">???</span></p>

<p class="mb0 b black-70">Revisions</p>
<progress id="revision" value="0" max="1" class="w-100 h1 br3">
</progress>
<p class="fr black-40 ttu mt0 f6 f5-ns b"><span id="revision-cur" class="orange"></span>/<span id="revision-total">???</span></p>

<p class="mb0 b black-70">Cleanup / features</p>
<progress id="cleanup" value="0" max="1" class="w-100 h1 br3">
</progress>
<p class="fr black-40 ttu mt0 f6 f5-ns b"><span id="cleanup-cur" class="blue"></span>/<span id="cleanup-total">???</span></p>

For the curious, here are the [underlying items](https://github.com/mbforbes/website-dev/issues?q=is%3Aissue+milestone%3A%22Summer+2021%22+). I later [allocated the bigger ones](https://github.com/mbforbes/website-dev/projects/1) to weeks in the summer, which has been quite helpful.

<script type="module">
    import { request } from "https://cdn.skypack.dev/@octokit/request";

    document.addEventListener('DOMContentLoaded', function() {

        function calcTime() {
            const start = new Date('July 14, 2021');
            const now = new Date();
            const deadline = new Date('October 1, 2021');
            let portion = 0;
            if (now > deadline) {
                portion = 1;
            } else {
                const total = deadline - start;
                const elapsed = now - start;
                portion = elapsed / total;
            }
            document.getElementById("time").value = portion;
            const dayStr = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(now);
            document.getElementById("time-cur").innerText = dayStr;
        }

        async function loadGithub() {
            const mResult = await request("GET /repos/mbforbes/website-dev/milestones/1");
            // console.log(mResult);
            const m = mResult.data;
            document.getElementById("milestone").value = m.closed_issues;
            document.getElementById("milestone").max = m.open_issues + m.closed_issues;
            document.getElementById("milestone-cur").innerText = m.closed_issues;
            document.getElementById("milestone-total").innerText = m.open_issues + m.closed_issues;

            const iResult = await request("GET /repos/mbforbes/website-dev/issues", {
                "state": "all",
                "per_page": 100,
            });
            // console.log(iResult);
            const allowed = ['new', 'series', 'revision', 'cleanup'];
            const closed = {}, total = {};
            for (let a of allowed) {
                closed[a] = 0;
                total[a] = 0;
            }
            for (let issue of iResult.data) {
                // make sure issue is of this milestone
                if (!issue.milestone || issue.milestone.number != m.number) {
                    continue;
                }
                // right now issues only have one relevant label, but I could imagine
                // something counting for multiple, and it's an array anyway, so loop.
                for (let label of issue.labels) {
                    // make the label is one we're tracking here.
                    if (allowed.indexOf(label.name) == -1) {
                        console.warn("Milestone issue w/ unrecognized label: '" + label.name + "'");
                    }
                    if (issue.state == "closed") {
                        closed[label.name] += 1;
                    }
                    total[label.name] += 1;
                }
            }

            // update html
            for (let a of allowed) {
                document.getElementById(a).value = closed[a];
                document.getElementById(a).max = total[a];
                document.getElementById(a + "-cur").innerText = closed[a];
                document.getElementById(a + "-total").innerText = total[a];
            }
        }

        calcTime();
        loadGithub();
    });
</script>
