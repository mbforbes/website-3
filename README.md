# website-3

Third (personal) website.

```bash
npm run serve
```

## Redirects

Just documenting this. Two techniques for two purposes: (1) moved URLs, (2) invented URLs for tweakers like me.

1. `redirect_from`
    - https://brianm.me/posts/eleventy-redirect-from/
2. `redirect_to`
    - uses same HTML
    - check redirects/ folder

## Weird double dates

Documenting this. Right now there's two notions of date:
- `travel_end`
- `date` (always publish date)

`travel_end` is displayed everywhere when available. On the Studio page, posts are sorted by `travel_end` if available, else `date`. (This is done within the big custom `dateSeriesGroupBy` filter in eleventy.js.) On the front page, posts are sorted by `date`---but `travel_end` is still displayed when available.

This is good because:
- travel posts appear by their actual end date
- generating digests will correctly grab using `date`
- front page shows recent posts, even if travel was a while ago

It's weird because
1. new posts about old travel will be buried on studio
2. front page lists old dates as more recent than newer ones

Probably nobody will ever care about 2., but 1. might hamper discoverability. (Then again, probs also doesn't matter.)

Ideally, I'd like to show both. Maybe both on the index page and on the individual posts. This might go along with reformatting post headers and frontmatter a little bit eventually. There's a bunch of stuff (local maps, regional maps, cover images, travel rating/date metadata) that doesn't cleanly fit in. And all h levels are a bit meager. (Custom travel header? New header that can have aspects remove gracefully?)


## WIP

- travel section
    - **/posts/2022-france/**

- don't forget
    - image macros (want to fully figure out first?)
    - consistent attributions
    - start / end dates
    - (adjust some old publish dates to just be end dates? or just display end date on index?)
    - maybe: metadata on travel post
    - maybe: next/prev browser (by post or travel date?)


- blog filenames
    - **2022-08-07-blah-blah**
