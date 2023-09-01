---
title: Infrastructure
date: 2022-08-28
image: /assets/blog/infrastructure/tram.moz80.jpg
---

![](/assets/blog/infrastructure/tram.moz80.jpg)

## The Recurrent Agony of Naming Things

I feel guilty naming this post "infrastructure" because it's such a good word. I love infrastructure, both physical and digital. And this is my one blog post I get about it.

By that I mean: if you look at the URL above, it should be (omitting my domain):
- `/blog/infrastructure/`

This means if I ever want to write a blog post about infrastructure again, I'll have to name it something else.

This kind of thing continuously gives me bite sized dread.

I originally picked URLs to work this way because I like clean URLs. My least favorite URLs look like:
- `/blog/2022/08/28/infrastructure-the-recurrent-ago-4ba239fe9ca/`

I don't like these because I like URLs to have a human-navigable interface about them. With URLs like that one,
- The final segment has that ugly hash at the end (`4ba239fe9ca`)
- The final segment also has not only the title (`infrastructure`) but an arbitrary first few characters of the post (`-the-recurrent-ago`)
- The segments (separated by `/`) to me read like directories. But:
    - How silly is it to have a full directory for each day? (`/2022/08/28/`) Like, you're probably not going to post multiple things per day.
    - Plus, in my experience, if you start pealing off `/` chunks of the path, you won't land on actual webpages. So, for example, `/blog/2022/08/` wouldn't actually take you to a collection of August 2022's blog posts.

To avoid all of the above bits of URL ugliness, I went with the simplest URL scheme when making this site:
- `/blog/{title}/`

But last week, the burden of permanently choosing and losing blog names was too much. It got to me.

So, I tried changing it.

On my website, pages are generated from file names. So for last weeks's post, rather than calling it
- `writing-vs-blogging.md`

... I called it
- `2022-08-21-writing-vs-blogging.md`

... in the hopes that it would generate a URL that looked like
- `/blog/2022-08-21-writing-vs-blogging/`

This would, at least, avoid the ugliness issues above (no extra words, no hash, no useless `/` segments), and let me reuse blog post titles if I wanted to.

But, lo and behold, the site generator framework helpfully recognized this as a way for me to date the blog post, and then stripped it off, dated the post that way, and kept the URL at:
- `/blog/writing-vs-blogging/`

Now, of course I could fight this. It would have been trivial to take one more step and manually set the title.

But I took it as a sign. Don't agonize over losing words. Use them. There are infinite sentences out there to use for blog post titles. It is OK. You can even do `/infrastructure-2-electric-boogaloo/` if you ever want. It is fine.

## Actually, In One Way of Looking, This Whole Blog Post is About Naming Things

Funny how that happens.

Let's talk about what else I did on my website this week.

## I Made New Top-Level URLs

It had bothered me that my website used paths like:
- `/blog/{title}/`
- `/garage/{title}/`
- `/posts/{title}/`
- `/sketches/{title}/`

...for individual posts, but none of these URLs worked if you stripped off the post name:
- `/blog/`
- `/garage/`
- `/posts/`
- `/sketches/`

I finally fixed that. I setup redirects that take you to the relevant section of the Studio page for each of those paths. They work! Check them out:
- [/blog/](/blog/)
- [/garage/](/garage/)
- [/posts/](/posts/) (just goes to homepage, relevant story below)
- [/sketches/](/sketches/)

As a small aside, one thing I absolutely promised myself when I made my latest website was that I would STOP CATEGORIZING THINGS. Everything would just be `/post/{name}/` and that was that. Categorization is the root of all evil. (The reason is that if you ever want to do something that's difficult to categorize, you will hesitate, and that is BAD, because that might be an indication you're doing something interesting.)

Needless to say, I've utterly failed at this. Not only do I now have all the above URL paths which are different top-level categories, but I've categorized my posts into single mutually exclusive compartments like "Design," "Programming," and so on.

Speaking of which.

## I Made All My Travel Blog Posts Become "Actual" Posts In a New "Travel" Tag

So in the [Studio](/studio/) page, there's now a "Travel" section under "Writing" where they all live.

All the old blog URLs redirect to them (because of course, the massive user base of my website just couldn't possibly handle it if my old URLs went broken).

This felt more fitting because they weren't blog posts anymore. Not really. A blog is the crap you're reading right now.

I also prefixed the posts with year names. This felt more fitting, especially as a post instead of a blog (more of a first-class thing now).
- `/blog/slovenia/` (old)
- `/posts/2022-slovenia/` (new)

It's a bit uglier to have the year in the URL, but I like the implication that it's _that one take_ of a place rather than my _definitive guide_ or something. Additional motivations for including a year: (a) I'm curious to try writing retrospectives about places visited a while back; (b) I noticed revisiting places that my impressions are different this time around.

I also used this change to split up some posts. Since my old format was a blog, there were some funny combinations based on where I'd happened to have been in the last week. So there'd be like "Cordoba & Porto v2" (further confused by the fact that nothing in it was about Porto). Now it's more split up by location. I also chopped up the massive France post into constituent cities. I did keep some aggregations---e.g., Croatia is one post rather than Dubrovnik, Primošten, and Zagreb. It's annoying to be inconsistent just because it means it's another thing I have to decide rather than do algorithmically. But I think it's for the better. I think some stretches of travel make sense as one narrative.

## The Big Thing I Did Was I Made Code To Generate Image Layouts Rather Than Writing The HTML By Hand

This was so satisfying. It was like long-needed code refactoring. Except even easier because rather than turning bad code into good code, I turned copy-pasted HTML into code that generated it.

What I did was make a custom "shortcode" that vomits out the HTML to arrange images into rows and columns.

This is best shown. So for example, if I write the following:^[Actually deprecated already. I'm now on a `img2` macro, which is used below to actually spit out the images.]

```json
{{ "{%" | e }} img [
    "/assets/posts/2022-slovenia/mangart-moss.moz80.jpg",
    [
        "/assets/posts/2022-france/lyon-city-church.moz80.jpg",
        "/assets/posts/2022-bilbao/art.moz80.jpg"
    ]
], true {{ "%}" | e }}
```

Then it will spit out the following carefully-constructed HTML:^[Editor's note: I used to actually just spit out the HTML itself from the shortcode, quote it in markdown, and show a live view. But I got too clever for my own good and started forbidding markdown from parsing the output of these shortcodes so now the HTML shown is copy pasted from a particular date (7/23/23). It's changed a lot since I wrote this blog post last August!]

```html
<div class="full-width cb flex justify-center ph1-m ph3-l figtop mb1">
    <div class="bgImageReady svgBlur"
        style="background-image: url('/assets/posts/2022-slovenia/mangart-moss.moz80.jpg');"
        data-background-image="url(/assets/posts/2022-slovenia/mangart-moss.moz80.jpg)">
    </div>
    <div class="flex justify-center" style="max-width: min(100%, 1252px, 133.3vh);">
        <img
            src="/assets/posts/2022-slovenia/mangart-moss.moz80.jpg"
            class="db bare novmargin h-auto bg-navy "
            loading="lazy" decoding="async"
            width="2504" height="1878"
            data-thumbhash-b64="XrcNNYSGiIh/eIiJd3d4eGZxcCUH"
            srcset="/assets/eleventyImgs/nGUkUWXnR2-313.jpeg 313w,
                /assets/eleventyImgs/nGUkUWXnR2-626.jpeg 626w,
                /assets/eleventyImgs/nGUkUWXnR2-1252.jpeg 1252w,
                /assets/eleventyImgs/nGUkUWXnR2-2504.jpeg 2504w"
            sizes="(max-width: 30em) 100vw, 100vw">
    </div>
</div>
<div class="full-width cb flex justify-center ph1-m ph3-l mt1 figbot">
    <div class="flex flex-wrap flex-nowrap-ns justify-center " style="max-width: min(100%, 1644px);">
        <div class="mr1-ns mb1 mb0-ns">
            <img
                src="/assets/posts/2022-france/lyon-city-church.moz80.jpg"
                class="db bare novmargin h-auto bg-navy "
                loading="lazy" decoding="async"
                width="1409" height="1878"
                data-thumbhash-b64="H/gFLQaAelVqR2Y3eoeMZlEwBAVD"
                srcset="/assets/eleventyImgs/n9bNix48Yg-353.jpeg 353w,
                    /assets/eleventyImgs/n9bNix48Yg-705.jpeg 705w,
                    /assets/eleventyImgs/n9bNix48Yg-1409.jpeg 1409w"
                sizes="(max-width: 30em) 100vw, 50vw">
        </div>
        <div>
            <img
                src="/assets/posts/2022-bilbao/art.moz80.jpg"
                class="db bare novmargin h-auto bg-navy "
                loading="lazy" decoding="async"
                width="1878" height="1878"
                data-thumbhash-b64="HggSDwCnloePh5d7Zzd1iXl3iPnHmG8L"
                srcset="/assets/eleventyImgs/VwDLQFV49n-470.jpeg 470w,
                    /assets/eleventyImgs/VwDLQFV49n-939.jpeg 939w,
                    /assets/eleventyImgs/VwDLQFV49n-1878.jpeg 1878w"
                sizes="(max-width: 30em) 100vw, 50vw">
        </div>
    </div>
</div>
```

... which then gets displayed like this on a webpage:

{% img2 [
    "/assets/posts/2022-slovenia/mangart-moss.moz80.jpg",
    [
        "/assets/posts/2022-france/lyon-city-church.moz80.jpg",
        "/assets/posts/2022-bilbao/art.moz80.jpg"
    ]
] %}

<!-- The little `true` at the end says to add a blurred image background to single images to stretch their width if need be. This isn't worth going into, other than that it took an unbelievable amount of time to figure out how to get working. -->

This really was the culmination of a lot of work to get images to display big and nice, which I've covered in varying levels of brevity in some garage entries like the [Image layout test page](/garage/image-layout-test-page/) and [Mo photos mo problems](/garage/mo-photos-mo-problems/). It even works to embed videos.

There remain more tweaks to be done. E.g., someday I'd like to get all images stretched out so the grid is always a full-screen width. But it's good enough for now.

This work has made the travel posts way more pleasing to look at behind the scenes, because rather than huge gross of piles of repeated HTML there are just little lists of photos.

## Epilogue

Max C mentioned how analytical my writing is, and wow I'm acutely aware of that writing this. Hey it's fun.

Also it's way past the ol bedtime gotta sleep. Just made it to Bosnia today, I'm amped to write about Serbia but I've got a month of Scotland to catch up on first. Spending a lot of time reading Wikipedia today. So much interesting extremely recent history in the Balkans. E.g., did you know Bosnia & Herzegovina has _three_ presidents at all times now?!
