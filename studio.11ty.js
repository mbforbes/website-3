const { DateTime } = require("luxon");
const fs = require("fs").promises;
const html = require("./common").html;

async function insert(path) {
  return await fs.readFile(path, "utf-8");
}

function capitalize(str) {
  return str
    .split(" ")
    .map((sub) => {
      return sub.charAt(0).toUpperCase() + sub.slice(1);
    })
    .join(" ");
}

/**
 * Sort function to put most recent entry first.
 */
function recentFirst(postA, postB) {
  return postB.date - postA.date;
}

function displayDate(ths, post) {
  let date = post.data.travel_end ?? post.date;
  return ths.readableDate(date);
}

function garageDate(post) {
  let date = post.data.updated ?? post.date;
  return DateTime.fromJSDate(date, { zone: "utc" }).toFormat("M/d/yy");
}

function renderPostText(post, date) {
  return html`
    <li class="mv1">
      <a href="${post.url}" class="db pv1 link">
        <time class="fr lightest-text-color ml3 f5">${date}</time>
        ${post.data.title}
      </a>
    </li>
  `;
}

function renderPostGrid(post, date) {
  return html`
    <a
      href="${post.url}"
      class="sans-serif h4 ba table-row-border-color pa2 f5 hover-off-bg-color flex flex-column justify-between"
    >
      <div>
        <time class="fr lightest-text-color ml3 f6">${date}</time>
        ${post.data.title}
      </div>
      <p class="mv0 ttu lightest-text-color f7 b">${post.data.series}</p>
    </a>
  `;
}

function stripTags(inputString) {
  return inputString.replace(/<\/?[^>]+(>|$)/g, "");
}

async function renderPostPhoto(ths, post, date) {
  const flexBasis = post.data.series ? "flex-basis: 32%;" : "";
  const titleFont =
    post.data.title.length > 55
      ? "f6 f5-m f4-l"
      : post.data.title.length > 45
      ? "f5 f4-l"
      : "f4";
  return html`
    <a
      href="${post.url}"
      class="h4 w-100 overflow-hidden flex items-center relative mv2 darken-bottom dim lh-title"
    >
      ${await ths.rawImg(
        post.data.image,
        [1408, 704],
        "(max-width: 704px) 100vw, 704px",
        "novmargin h-auto"
      )}
      <div
        class="w-100 h-100 pa2 z-2 absolute white sans-serif flex justify-between items-end"
        style="text-shadow: 1px 1px 1px black;"
      >
        <p class="mv0 ${titleFont}" style="${flexBasis} text-wrap: balance;">
          ${post.data.title}
        </p>
        ${post.data.series &&
        html`<p class="mv0 f6 fw6 ttu tracked tc">${post.data.series}</p>`}
        <p class="mv0 f6 tr" style="${flexBasis}">${date}</p>
      </div>
    </a>
  `;
}

async function renderPostThumb(ths, post, date) {
  const excerpt = stripTags(post.data.customexcerpt ?? post.content).slice(0, 120);
  return html`
    <a
      href="${post.url}"
      class="db mv3 sans-serif nohoverstyle hover-off-bg-color hover-visible-container pa3 ba table-row-border-color"
      style=""
    >
      <div class="flex space-between" style="gap: 10px;">
        ${await ths.thumb(
          post.data.image,
          250,
          "novmargin w-20",
          "aspect-ratio: 3/2; object-fit: cover; height: auto;"
        )}
        <div class="flex flex-column flex-auto" style="gap: 0px">
          <div class="flex justify-between">
            <p class="mv0">${post.data.title}</p>
            <time class="lightest-text-color f5" style="flex-shrink: 0">${date}</time>
          </div>
          <p
            class="f5 lh-title mv0 lighter-text-color serif dn db-ns overflow-hidden hover-visible"
          >
            ${excerpt}
          </p>
        </div>
      </div>
    </a>
  `;
}

function renderSoftware(item) {
  return html`
    <!-- NOTE: Extra <div> for .markdown-body mw7 removal. Border goes outside
        padding, and we really want a margin. -->
    <div>
      <div class="pl3 bl bw1 mb4">
        <a href="${item.data.software_url}" class="f5 f4-ns b code"
          >${item.data.title}</a
        >
        ${item.data.language
          ? html` <span class="dib fr">
              <img
                class="h1 novmargin mt1 black-and-white ${item.data.language}"
                src="/assets/img/langs/${item.data.language}.svg"
              />
            </span>`
          : ""}
        ${item.templateContent && item.templateContent.length > 0
          ? html` <details>
              <summary class="mv1 pointer f5 f4-ns sans-serif">
                ${item.data.summary}
              </summary>
              <p class="f6 f5-ns">
                ${item.templateContent.replace("<p>", "").replace("</p>", "")}
              </p>
            </details>`
          : html` <p class="mv1 f5 f4-ns">${item.data.summary}</p>`}
      </div>
    </div>
  `;
}

async function listPostsAndSeries(ths, collection, display) {
  let groups = ths.dateSeriesGroupBy(collection);
  return (
    await Promise.all(
      groups.map(async (group) => {
        const isSeries = group.series != "";
        const numberPosts = isSeries && display == "text";
        const posts = (
          await Promise.all(
            group.posts.map(async (post) => {
              let date = displayDate(ths, post);
              switch (display) {
                case "thumb":
                  return renderPostThumb(ths, post, date);
                case "photo":
                  return renderPostPhoto(ths, post, date);
                default:
                  return renderPostText(post, date);
              }
            })
          )
        ).join(" ");

        return html`
          <ul class="list pa0 mt0 ${display == "photo" ? "mb0" : ""}">
            ${isSeries && display != "photo"
              ? html`<li class="mb1 mt4 f5 fw6 ttu tracked">${group.series}</li>`
              : ""}
            ${numberPosts
              ? html`<ol class="mb4">
                  ${posts}
                </ol>`
              : isSeries && display != "photo"
              ? html`<div class="mb5">${posts}</div>`
              : html`${posts}`}
          </ul>
        `;
      })
    )
  ).join(" ");
}

async function garageGrid(ths, collection) {
  // NOTE: May group by status or category in the future.
  let posts = collection
    .toSorted(recentFirst)
    .map((post) => {
      return renderPostGrid(post, garageDate(post));
    })
    .join(" ");

  return html`<div
    class=""
    style="display: grid; gap: 10px; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));"
  >
    ${posts}
  </div>`;
}

function h2(name, style = "", displayName = null) {
  return html`<h2 id="${name}" style="${style}">
    ${displayName ?? capitalize(name)}
    <a class="header-anchor" href="#${name}" aria-hidden="true">#</a>
  </h2>`;
}

class Studio {
  data() {
    return {
      title: "Studio",
      hidedate: true,
      layout: "layouts/default.njk",
      delaytitle: true,
      eleventyExcludeFromCollections: true,
      eleventyImport: {
        collections: ["all"],
      },
    };
  }

  async render(data) {
    // create writing section
    const writingTags = [
      ["travel", "photo"],
      ["programming", "text"],
      ["design", "thumb"],
      ["creating & thinking", "text"],
      ["health", "text"],
    ];
    const writingSection = (
      await Promise.all(
        writingTags.map(async ([tag, display]) => {
          const tagSlug = this.slug(tag);
          return html`
            <!-- Tag header -->
            <h3 id="${tagSlug}">
              ${capitalize(tag)}
              <a class="header-anchor" href="#${tagSlug}" aria-hidden="true">#</a>
            </h3>

            <!-- Listing -->
            ${await listPostsAndSeries(this, data.collections[tag], display)}
          `;
        })
      )
    ).join(" ");

    const software = data.collections.software.filter((item) => {
      return item.data.tags.indexOf("studio") > -1 && !item.data.omit;
    });
    const latestMicroblog = data.collections.microblog.toSorted(recentFirst)[0];

    // prettier-ignore
    return html`
      <!-- Big honkin header -->
      <div class="mb4 mb5-l mt5 mt6-l">
        <h1
          class="f1 f-5-l fw9 lh-solid mt0 mb5 flex justify-between items-baseline"
          style=""
        >
          Studio

          <!-- swap "dn" -> "flex" with js once page loaded -->
          <div
            id="layout-button-holder"
            class="dn justify-end"
            style="column-gap: 0.5rem;"
          >
            <div
              id="layout-button-list"
              class="w2 h2 ba br1 bw1 flex items-center justify-center layout-button active"
            >
              ${await insert("assets/img/icon-list.svg")}
            </div>
            <div
              id="layout-button-card"
              class="w2 h2 ba br1 bw1 flex items-center justify-center layout-button"
            >
              ${await insert("assets/img/icon-card.svg")}
            </div>
          </div>
        </h1>
      </div>

      <!-- Layout: list by category -->
      <div id="list-category-layout" class="layout">
        ${h2("writing", "margin-top: 0px;")} ${writingSection} ${h2("projects")}
        ${await listPostsAndSeries(this, data.collections.project, "text")}

        ${h2("software")}
        ${await this.renderTemplate(
          `{% include "programming-language-tooltips.njk" %}`,
          "njk"
        )}
        ${software.map((item) => renderSoftware(item)).join(" ")}
        <p>
          You might also be interested in checking out my
          <a href="/research/#software">research software</a>.
        </p>

        ${h2("sketches")}
        <div
          style="display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));"
        >
          ${data.collections.sketch
            .toSorted(recentFirst)
            .map((sketch) => {
              return html`
                <a href="${sketch.url}">
                  <img
                    class="dim novmargin bg-navy"
                    src="${sketch.data.thumb}"
                    width="216"
                    height="216"
                    style="height: auto;"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              `;
            })
            .join(" ")}
        </div>

        ${h2("blog")}
        ${await listPostsAndSeries(this, data.collections.blog, "text")}

        ${h2("microblog", "", "µblog")}
        <p><a href="/microblog/">See all.</a></p>
        <div class="pl3 pv1 bl bw1 mb4">
          <p class="f6 f5-ns lightest-text-color">
            Latest: ${displayDate(this, latestMicroblog)}
          </p>
          <p class="f5 f4-ns lighter-text-color">${latestMicroblog.templateContent}</p>
        </div>

        ${h2("garage")}
        <p class="f6 f5-ns">
          The garage is an experiment in "working with the garage door up."
          These evolving notes are written for me but posted publicly here.
          Read more in
          <a href="/garage/what-is-the-garage/">What is the garage?</a>
        </p>
        ${await garageGrid(this, data.collections.garage)}
      </div>

      <!-- Layout: card layout -->
      <div id="card-layout" class="layout full-width">
      ${await this.renderTemplate(
          `{% include "layouts/card-layout.njk" %}`,
          "njk",
          {collections: data.collections}
        )}
      </div>

      <!-- Code for switching between layouts -->
      <script type="text/javascript" src="/assets/js/layout-switching.js" defer></script>
    `;
  }
}

module.exports = Studio;
