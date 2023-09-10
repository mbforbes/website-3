# website-3

Third iteration of my (personal) website. Live at: **https://maxwellforbes.com**

```bash
rm -rf _site && npm run serve
```

## Tests

```bash
python scripts/garage_links.py
rm -rf _site && npm run serve
# in a new tab:
python scripts/test_common.py && python scripts/test_link_finder.py && python scripts/test_link_graph.py
```

## Docs

### Redirects

Two techniques for two purposes: (1) moved URLs, (2) invented URLs for tweakers like me.

1. `redirect_from`
   - https://brianm.me/posts/eleventy-redirect-from/
2. `redirect_to`
   - uses same HTML
   - check redirects/ folder

### Weird double dates

Right now there's two notions of date:

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

(Actually, there's now `updated`, so it's triple dates.)

### Series

Esp. featuring dates and sorting.

Right now, series is kind of a mess. It should probably be implemented with Eleventy's Collections. I think it's a bad fit to have a tag per series, but I'm not positive.

Right now, logic to handle sorting and ordering and displaying Series is spread out across:

1. `eleventy.js`, the `dateSeriesGroupBy` filter
2. `_includes/list-posts-and-series.njk` (for listings in Studio)
3. `_includes/series-top.njk`
4. `_includes/series-bottom.njk`

## TODO

- [ ] try to get all citymaps w/ attributions swapped to being at end
  - could check w/ regex, but also want to do citypics after them where applicable
- [ ] cover images: re-export so big enough!?
- [ ] new macro or solution for images like sketches (ramen ode) that really ought to simply be constrained by max width or height (but want macro goodies like bg placeholder etc)
- [ ] Have card layout hide horizontal scrollbar (see if fixes); freaks out when cards are initially flipping
- [ ] Fix text colors for dark mode in SVGs in Every PhD is Different
- [ ] Make Aside: in "Animating SVGs from Sketch with anime.js" actually an aside
- [ ] ~~youtube -> vimeo as much as possible~~ videos just files?
- [ ] Syntax highlighting w/ diffs + code captions: update ECS posts to use (WIP)
- [ ] Ping Brian re: redirect dependency
- [ ] Swap series bottom w/ footnotes
- [ ] next post in category when not series
- [ ] Can I get the style.css?v=XXX to auto-update in head.njk when I change the css (or just always)?
- [ ] try to re-fix tables (borders gone for the .markdown-body mw7 removal to get padding to work)
- [ ] Show snippets when linking between posts
- [ ] Constrain sketches to not go beyond width or height (see e.g., voxel material study)
- [ ] Some kind of debug data to reliably turn path display for images on and off? Command line flag, data into cascade, ...? Right now changing and reloading the `.eleventy.js` file during a build is buggy.
- [ ] new analytics
- [ ] unified post view for studio
- [ ] do we want TOC?
- [ ] the great blockquote fixup
  - note: esp on mobile, and esp double quotes. probably find set of test cases.
  - [ ] plus extend for aside, etc.
    - (how to markup? leaving markdown annoying: footnotes, etc.)
- [ ] should we do a non-image twitter card when there's no page image? or default to a generic site one?

Notes from trying on 4K screen:

- **consistent margins** --- driving me nuts

  - center group map / map+series bubbles
    - - actual bubble around series?
  - can photos be max-width'd closer to their true width? likely displaying @ full-size will mean @1x density, so there's no reason to limit to 1/2
  - consider max-width'ing inline full-width post elements (maps)
  - max-width cover img? w/ border when smaller?
  - jagged margins of inline posts
  - ... and horrible stretching
  - maybe increase media max-width; look @ ratio from body text. or just go much wider

- larger thought: if it's too much work to keep v1 and v2, don't do it. honestly may not need w/ full display capping to some reasonable amt (2000px w?)

- [ ] Can we have the blur svgs reveal a bit earlier? They pop in while visible. Only do if still needed after margins update.

- maybe bigger fig margins for sufficiently large screen

- maybe export body-width-limited photos to a multiplier of 704

- make footer at bottom (I think html 100% (min-?)height, body min-height 100% might do the trick)

## Note on Legacy

If I ever stop renewing my domain (`maxwellforbes.com`), this site will stay live at the Cloudflare Pages domain it automatically got (`website-3.pages.dev`). That ought to work until Cloudflare deprecates the product or the company shuts down. Then, it's back to dust.
