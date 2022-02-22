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
    - (project)
        - main.js
        - img.png
        - sound.mp3
    - 3js-experiments
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
