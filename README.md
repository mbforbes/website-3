# website-3

Third (personal) website.

## WIP

Stuff to not forget

- stuff commented out in eleventy (e.g., xml/json feeds)
- 404 page
- additional includes in the default layout
- nouveau syntax highlighting (check how works)
- all template variables in _includes (i think they'll just be omitted if broken)
- can i remove .pagetitle var? (used in default.njk)
- image urls (e.g., see head.njk) might be broken
- should we do a non-image twitter card when there's no page image? or default to a generic site one?
- are social tags actually correct now?
- replace scribbles
- all libs local (i think tachyons CSS is still imported from unpkg)
- CSS relative support? nunjucks? (absolute URL rn...)
- meta tags have to have actual URLs (e.g., image), so need to adjust site url along with path prefix
- fix rest of meta tags
- fix content with `markdown="1"` because markdown-it doesn't support that (or dig harder to find / implement myself)
- fix (c) -> © --- possible to disable while keeping other typographer things? (are they useful?)
- if really want to host on github.io, a few more things broken or probs broken:
    - resources for running code (need to prefix in all code libs) (e.g., sketch/thinking)
    - however garage links are done probably needs to handle too
    - idea: could solve both the above w/ some JS globals

### code organization

Worth it to move /dev under /assets? as /code?
Also removing code building / compiling that lives here? (e.g., node modules etc?)

Could organize like

- assets/
    - code/
        - (project)/
            - main.js
        lib/
            - pixi-vX.js
            - three-vY.js
    - (project)/
        - img.png
        - sound.mp3

Seems arbitrary to split up code and imgs

- assets
    - lib/
        - pixi-vX.js
        - three-vY.js
    - posts/
        - (project)
            - main.js
            - img.png
            - sound.mp3
    - sketches/
        - (project)
            - main.js
            - img.png
            - sound.mp3
    - 3js
        - 1-x.js
        - 2-y.js
        - (subproject)
            - main.js
            - img.png
            - sound.mp3

maybe that's good.

### site org

All locations under posts/

W/ URLs:
- /posts/XX
- /blog/XX
- /sketches/XX
    - w/ redirects from old (~ /posts/sketch-XX )
- /garage/XX

W/o URLs:
- news/
    - (just get merged into feed)
- software/
    - (subsets get rendered in various places manually)
