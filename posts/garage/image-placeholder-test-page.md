---
title: Image Placeholder Test Page
date: 2023-07-16
coverImage: /assets/garage/image-placeholder-test-page/test-cover.moz80.jpg
---

## Inline

![](/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg)

## `cityMap`

{% cityMap "/assets/posts/2022-lisbon/lisbon-portugal-23-perimeter.moz80.jpg" %}

<p class="figcaption">Static</p>

{% cityMap [
    "/assets/posts/2022-busan/busan-map-0.moz80.jpg",
    "/assets/posts/2022-busan/busan-map-1.moz80.jpg",
    "/assets/posts/2022-busan/busan-map-2.moz80.jpg",
    "/assets/posts/2022-busan/busan-map-3.moz80.jpg"
], false, true, true, "pv3" %}

<p class="figcaption">Animated</p>

{% cityMap [
    "/assets/posts/2023-taipei/taipei-taiwan-0-combined.png",
    "/assets/posts/2023-taipei/taipei-taiwan-1-combined.png",
    "/assets/posts/2023-taipei/taipei-taiwan-2-combined.png",
    "/assets/posts/2023-taipei/taipei-taiwan-3-combined.png"
], false, true, true, "", false, "", true %}

<p class="figcaption">"plain big"</p>

## `cityPic`

{% cityPic "/assets/posts/2022-georgia/t-city-window.moz80.jpg" %}

## v1 (`img`)

### Full-width

(Just switching to v2 but using old ("v1") images.)

{% img2 [
    "/assets/garage/image-test-pages/v1-2504x1878.moz80.jpg",
    [
        "/assets/garage/image-test-pages/v1-2504x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-2504x1878.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v1-1409x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-1409x1878.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v1-2504x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-2504x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-2504x1878.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v1-1409x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-1409x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-1409x1878.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v1-1409x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-2504x1878.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v1-2504x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-1409x1878.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v1-1409x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-2504x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-2504x1878.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v1-2504x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-1409x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-2504x1878.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v1-2504x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-2504x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-1409x1878.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v1-1409x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-1409x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-2504x1878.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v1-1409x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-2504x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-1409x1878.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v1-2504x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-1409x1878.moz80.jpg",
        "/assets/garage/image-test-pages/v1-1409x1878.moz80.jpg"
    ],
    "/assets/garage/image-test-pages/v1-1409x1878.moz80.jpg"
] %}


## v2 (`img2`)

### Full-width

{% img2 [
    "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
    [
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg"
    ],
    "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg"
] %}

NOTE: If I ever implement heights, test by replacing the tall img (`v2-1016x1522`) with `v2-1521x2280`.

### Inline

{% img2 [
    "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
    [
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg"
    ],
    [
        "/assets/garage/image-test-pages/v2-2280x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg",
        "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg"
    ],
    "/assets/garage/image-test-pages/v2-1016x1522.moz80.jpg"
], {fullWidth: false} %}
