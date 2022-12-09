---
title: Edinburgh
subtitle: Land of Abundant Greenery and Nearly Permanent Gloom
date: 2022-09-05
travel_start: 2022-07-17
travel_end: 2022-07-31
image: /assets/posts/2022-edinburgh/church-angle.moz80.jpg
---

{% cityMap "/assets/posts/2022-edinburgh/edinburgh-scotland-1-perimeter.moz80.jpg" %}

{% img "/assets/posts/2022-edinburgh/city.moz80.jpg" %}

Ahh, back to the motherland, where I finally get the respect and admiration I deserve as bishop.

{% img "/assets/posts/2022-edinburgh/bishop-forbes.moz80.jpg" %}

It was a strange novelty seeing my last name in a bunch of places. But we'll have to wait for the next post (Scottish Highlands roadtrip) for more of that.

Anyway, cue Edinburgh A-roll.

{% img [
    [
        "/assets/posts/2022-edinburgh/monument.moz80.jpg",
        "/assets/posts/2022-edinburgh/hill.moz80.jpg"
    ],
    [
        "/assets/posts/2022-edinburgh/church-entrance.moz80.jpg",
        "/assets/posts/2022-edinburgh/tree-canal.moz80.jpg"
    ],
    "/assets/posts/2022-edinburgh/church-angle.moz80.jpg",
    "/assets/posts/2022-edinburgh/julie-cliff.moz80.jpg",
    [
        "/assets/posts/2022-edinburgh/museum-probs.moz80.jpg",
        "/assets/posts/2022-edinburgh/streets.moz80.jpg"
    ],
    [
        "/assets/posts/2022-edinburgh/tree-path-tall.moz80.jpg",
        "/assets/posts/2022-edinburgh/tree-path-green.moz80.jpg"
    ],
    "/assets/posts/2022-edinburgh/uni-close.moz80.jpg",
    "/assets/posts/2022-edinburgh/park-clouds.moz80.jpg",
    [
        "/assets/posts/2022-edinburgh/night-building.moz80.jpg",
        "/assets/posts/2022-edinburgh/night-house.moz80.jpg"
    ],
    "/assets/posts/2022-edinburgh/night-complex.moz80.jpg"
], true %}

## A Fortnight[^fortnight] Home

[^fortnight]: Google actually asked  _"Did you mean: fortnite?"_ when I checked to see if a fortnight is indeed two weeks and not twenty days, so anyway I hate that.

We spent two weeks in Edinburgh. This is the longest we've stayed in one spot since we left Seattle at the end of March.

It was surprisingly easy to get the _I don't want to moooooove_ feeling. Since we've now left, I can tell you the feeling went away once we got on the road again. I guess you could say that inertia is strong, whether you're traveling or nesting.

Just talking to people in our mutual native tongues was such a welcome reduction in daily micro effort. Also, to be perfectly honest, just not worrying about being pickpocketed.

We were lucky to find an AirBnb to stay in that was someone's actual home. And it was a new listing, so still cheap. Look at this gorgeous living room.

![]({{ "/assets/posts/2022-edinburgh/home.moz80.jpg" | url }})

We only got it for one week, and apparently we cashed in our AirBnb karma because the second week we ended up in one of those barren, everything-more-than-slightly-broken crapholes, in which, at night, I would lay on the many piles of sharp springs and imagine the YouTube video that could have sparked our faceless host's landlording, _Hey You Budding Entrepreneur, Make Passive Income With No Effort_ etc.

But let's not talk about that one. The first one was awesome.

We stayed in an area called Leith Walk, which seems to be this long road connecting the city center to the harbor (Leith). This was so lucky---turned out to be the best spot in the city. Lots of good pubs around, still quiet at night, and away from the tourist-mobbed old town. Pleasant walk to climbing gym, parks, or city center.

I was initially worried we should have stayed in the district on the water that's actually called "Leith."[^leith] Upon walking there we realized we did make the right choice; Leith (harbor) had a bunch of new housing developments and that was basically it.

[^leith]: Locals might actually call where we were "Leith," so don't trust my terminology.

![]({{ "/assets/posts/2022-edinburgh/leith-bridge.moz80.jpg" | url }})

<p class="figcaption">Still pleasant for a stroll though.</p>

## Edinburgh Itself

Buildings looked like they were being permanently rained on, even when it was sunny.

{% img "/assets/posts/2022-edinburgh/building-side.moz80.jpg" %}

I was constantly craning my head to look up at these super elongated conical towers shooting out of the gray and dirty brown wallscape.

{% img "/assets/posts/2022-edinburgh/big-church-top.moz80.jpg" %}

I have never thought about seagulls as much as I have in Edinburgh. We have them in Seattle, but they're more of a "you're visiting the downtown piers" or "you're at the Ballard Locks" novelty.

What I learned here is that they will scream endlessly through the night. 3am? No problem, they're still screaming.

Fortunately we had decided at some point that all seagulls were called _Jerry,_[^jerry] so I could lie in bed and just think, "ah Jerry, you old rascal, wish you'd just die, no worries mate," etc.

Here are some Jerries screaming about how nice the sunset is in 4K.

{% img {vimeoInfo: "744493469?h=da1808955c", videoStyle: "width: 100%; aspect-ratio: 16 / 9;"} %}

[^jerry]: No relation to Seinfeld. Jerry just seemed like a good seagull name.

## Interlude: UK _vs_ Great Britain

<link rel="stylesheet" href="{{ "/assets/css/leaflet.css" | url }}" />
<link rel="stylesheet" href="{{ "/assets/css/maps.css" | url }}" />
<script type="text/javascript" src="{{ "/assets/lib/leaflet-1.8.0.js" | url }}"></script>
<script type="text/javascript" src="{{ "/assets/lib/tile.stamen-1.3.0.js" | url }}"></script>
<script type="text/javascript" src="{{ "/assets/lib/anime-3.2.1.min.js" | url }}"></script>
<script type="text/javascript">
let libDir = "{{ "/assets/mapData/" | url }}";
</script>
<script type="text/javascript" src="{{ "/assets/posts/2022-edinburgh/uk-vs-gb.js" | url }}"></script>

I have always used _UK,_ _Great Britain,_ and _England_ interchangeably. I finally decided to learn the distinctions.

To start, let's look at geography without political boundaries. The complete set of islands in the whole area is called the _British Isles._ This is broken up into two: the island on the left is _Ireland,_ and the bigger island on the right (plus its little fragments) is called _Great Britain._

> Note: If you're a regular visitor and don't see any maps below, please hard-refresh the page (`⌘`+`Shift`+`R` on Mac, `Ctrl`+`Shift`+`R` Win/Linux).

<div id="mapGeo" class="leafletMap fig center">
<img src="{{ "/assets/posts/2022-edinburgh/map-geo-screenshot.png" | url }}" />
</div>
<div class="figcaption">
<span class="b">British Isles</span>:
<div class="keyBox b--hot-pink bg-02-hot-pink"></div>
Ireland
<div class="keyBox b--purple bg-02-purple"></div>
Great Britain
</div>

I'm already cheating a bit; sometimes (Great) Britain is just the one big island on the right, and sometimes it also encompasses all the nearby fragment islands.

Now it gets messy. Ireland is broken up into two countries: _Republic of Ireland_ and _Northern Ireland_. And Great Britain is broken up into three countries: England, Wales, and Scotland.

<div id="mapCountry" class="leafletMap fig center">
<img src="{{ "/assets/posts/2022-edinburgh/map-countries-screenshot.png" | url }}" />
</div>
<div class="figcaption">
<span class="b">Countries</span>:
<div class="keyBox b--orange bg-02-orange"></div>
Republic of Ireland
<div class="keyBox b--green bg-02-green"></div>
Northern Ireland
<div class="keyBox b--blue bg-02-blue"></div>
Scotland
<div class="keyBox b--yellow bg-02-yellow"></div>
Wales
<div class="keyBox b--red bg-02-red"></div>
England
</div>

Already, there's something I didn't realize: that England, Scotland, and Wales are countries. I thought the UK was the country? (Plus, Northern Ireland is variously called a country, region, or territory.)

Anyway, yes, it turns out you can have countries within countries. The way that Wikipedia at least handles this is calling the UK, fully known as _The United Kingdom of Great Britain and Northern Ireland,_ a "sovereign country."

<div id="mapPolitical" class="leafletMap fig center">
<img src="{{ "/assets/posts/2022-edinburgh/map-sovereign-screenshot.png" | url }}" />
</div>
<div class="figcaption">
<span class="b">Sovereign Countries</span>:
<div class="keyBox b--orange bg-02-orange"></div>
Republic of Ireland
<div class="keyBox b--blue bg-02-blue"></div>
United Kingdom
</div>

This is the broad picture. Plenty of complications exist, which I'll broadly categorize into two buckets:

1.   **Extra territories.** For example: The little blob in the middle, which is called the _Isle of Man_ and is apparently a "self-governing British Crown dependency."

2.   **Varied Usage.** I'll let Wikipedia give the example here:

     > The Guardian and Telegraph use Britain as a synonym for the United Kingdom. Some prefer to use Britain as shorthand for Great Britain. The British Cabinet Office's Government Digital Service style guide for use on gov.uk recommends: "Use UK and United Kingdom in preference to Britain and British (UK business, UK foreign policy, ambassador and high commissioner). But British embassy, not UK embassy." ([Wikipedia: UK](https://en.wikipedia.org/wiki/United_Kingdom))

**Attributions:** The maps are drawn using [Leaflet](https://leafletjs.com/); Map tiles by [Stamen Design](https://stamen.com/), under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). Map data by [OpenStreetMap](https://www.openstreetmap.org/), under [ODbL](https://www.openstreetmap.org/copyright). The data I used to draw the colored overlays are from several sources: [Country centroids](https://github.com/mihai-craita/countries_center_box); [UK and Ireland](https://datahub.io/core/geo-countries#data); [Scotland and N Ireland](https://github.com/Crunch-io/geodata); and [England and Wales](https://martinjc.github.io/UK-GeoJSON/).

**See also:** [This map](https://www.britannica.com/story/whats-the-difference-between-great-britain-and-the-united-kingdom) by Encyclopedia Britannica. I emailed them to see if I could put the map in this blog post and they ~~never replied~~ said I'd have to pay them, so naturally I instead spent a gazillion hours making my own.

This concludes our geographic interlude. Next stop is Edinburgh's big old castle.

## Edinburgh Castle

{% img "/assets/posts/2022-edinburgh/castle-location.moz80.jpg" %}

The castle is the Big Tourist Thing you go do in town. Since we were in Edinburgh long enough to eat Krispy Kreme and play mini golf we didn't really have any excuse, so off we went.

Let's start with the good: there is some cool castle-y architecture there, maps and stained glass (both of which I always like looking at), and some quality city panoramas.

{% img [
    [
        "/assets/posts/2022-edinburgh/castle-tower.moz80.jpg",
        "/assets/posts/2022-edinburgh/castle-bay.moz80.jpg"
    ],
    [
        "/assets/posts/2022-edinburgh/castle-maps.moz80.jpg",
        "/assets/posts/2022-edinburgh/castle-glass-bue.moz80.jpg"
    ],
    "/assets/posts/2022-edinburgh/castle-view.moz80.jpg"
], true %}

<p class="figcaption">
On the left part of the skyline you can see the building we nicknamed The Cowlick. The one time we got close to it we couldn't go in for some reason. The curvy metal cowlick itself goes all the way to the ground and is super climbable, but they figured that out (probably drunken Scots help you figure things like this out quickly) and had jerry-rigged a barricade.
</p>

The rest of the castle was kind of a weird copy-paste of a bunch of indistinguishable _British Wars Across the Ages_ exhibits (spoiler, there has been A LOT of them). I guess being ~½ of Britain (sorry Wales) Scotland just kind of got roped into all of them.

E.g., heroic figure recreating one of the crown's many conquests / looting agendas:

![]({{ "/assets/posts/2022-edinburgh/castle-figure.moz80.jpg" | url }})

<p class="figcaption">
The reason I took this photo was my continued amusement that the iPhone's portrait mode works on inanimate objects. I'm not sure why that entertains me.
</p>

I'm not saying the exhibits were bad, it's just... they all felt the same. There didn't seem to be a narrative driving any one separately from the other. So after a dozen or two rooms of swords and guns and outfits and dates and facts and locations, it all quickly blurs into _Rooms of Military Stuff._

One upside is this made me aware of the nuance and art of curation. I bet that curation is invisible when done well: you just go through something and enjoy it. You only notice curation when done badly.[^curation] Damn, must be a thankless job.

[^curation]: I get it, too, the lack of incentive to dramatically re-curate the whole thing. With all these historic military objects, it would feel wrong to just put, I don't know, 50% or 75% of them away into boxes. Especially since there's already been hundreds of person-hours doing background research, setting up the scenes, writing all the plaques, and probably carefully constructing categories that I completely missed. Plus the castle is doing great business; place was packed, and you had to reserve in advance because they were at total capacity every hour of the day.

I did learn some things, like that commanding military people would traditionally give their reports silver after a successful campaign.

![]({{ "/assets/posts/2022-edinburgh/castle-silver.moz80.jpg" | url }})

<p class="figcaption">Hey, silver seems nice.</p>

What I really wanted, though, was Scottish _vs_ English drama. Come on, guys! Where's the juicy stuff? _Everything_ was post-Britain unification.[^unification]

[^unification]: Wikipedia [tells me](https://en.wikipedia.org/wiki/Acts_of_Union_1707) Scotland and England (and Wales) joined into Great Britain in 1707.

Maybe I'm the only one who wanted this. I think it's all because I grep up playing Age of Empires II, where you play as brave 🏴󠁧󠁢󠁳󠁣󠁴󠁿 William Wallace's in his campaign against 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Edward Longshanks (late 1200s) for the tutorial mission. This led me to do a middle school report on William Wallace, incl. constructing a cardboard project display with the tops cut out in alternating square to look like battlements.

The _one_ potential reference I saw, unadorned by any plaque or caption, in some small miscellaneous room by this ultra large cannon[^cannon] they kept around, was this stained glass window.

[^cannon]: As we approached the monstrous cannon, a ~ten-year-old would not stop proclaiming to his mom that _he_ had seen a _bigger_ cannon already. The everyday patience of normal parents is unlike anything I can imagine.

{% img "/assets/posts/2022-edinburgh/castle-glass-red.moz80.jpg" %}

<p class="figcaption">If this isn't William Wallace, please don't tell me.</p>

I have saved the best for last. A bunch of rooms had bagpipes blaring out songs (which you could hear from way off, just like the real thing). I looked around in one room and located the source of the noise: a CD player they shoved up near the ceiling and set on Torture Indefinitely mode.

<iframe src="https://player.vimeo.com/video/744493369?h=bedc16f230&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&autoplay=1&loop=1&muted=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="bagpipes-on-loop.mov" style="width: 100%; aspect-ratio: 16 / 9;" class="fig"></iframe>

<p class="figcaption">Now that I am forced to explain why I found this so great, I am at a loss for words. Somehow the acute sonic injury of nonstop bagpipes seemed made even more pointless by this ancient rigged apparatus. But the truly best part was, as I was standing there wondering how anyone could distinguish the notes, a man comes in and starts cheerfully <span class="i">whistling along</span> with the tune. I suddenly felt more like a foreigner than I had in a long time.</p>

## Nature Bafflement

Here's what baffled me: there are **private parks** here. Like right in the middle of the city. Big parks you can't enter. They're totally fenced off and all entrances are locked with a key.

![]({{ "/assets/posts/2022-edinburgh/private-park.moz80.jpg" | url }})

I found what looked like a really nice park super close to the city center but I couldn't see a way in. I couldn't imagine it being not open to the public, so I walked around the whole thing. (It is quite big.)

![]({{ "/assets/posts/2022-edinburgh/private-park-location.moz80.jpg" | url }})

<p class="figcaption">Map source: OpenStreetMap</p>

Even when I saw signs mentioning applying for a set of keys, I assumed that was for like, special events, and not everyday use.

Finally I saw someone walking an expensive looking dog whisk out a set of keys and open one of the doors.

![]({{ "/assets/posts/2022-edinburgh/private-park-gate.moz80.jpg" | url }})

So yeah, a completely foreign concept.

I was able to entertain myself strolling through some of the parks that are public. They had about 1000x more birds in them, and were usually quite swampy.

{% img [
    "/assets/posts/2022-edinburgh/swamp-trees.moz80.jpg",
    "/assets/posts/2022-edinburgh/swan.moz80.jpg"
], true %}

To complete the bafflement, there was a big and delightful botanical garden that was completely free.

{% img "/assets/posts/2022-edinburgh/long-hedge.moz80.jpg" %}

The weirdest thing in the garden was this memorial hut for a person Wikipedia tells me I'm to refer to as _Queen Elizabeth The Queen Mother_ (mom of current ancient queen). The inside is completely plastered with pine cones and sea shells that way a child might decorate a tree house, but because adults did it for royalty it's like, sort of nice?

![]({{ "/assets/posts/2022-edinburgh/weird-nature-hut.moz80.jpg" | url }})

The other weird thing in it was this stone work with typographic decisions I have never seen in English: stacked and embedded letters. The memorial must have been post-2002 (that's when she died), so maybe this is some stonework nouveau trend.


![]({{ "/assets/posts/2022-edinburgh/weird-typography-close.moz80.jpg" | url }})

<p class="figcaption">
Or maybe this is common and I need to brush up on my rock typography.
</p>

## Food

Ever since we spent a few days in [Nerja](/posts/2022-nerja/) (south Spanish coast) and saw restaurants advertising _English breakfast,_ I've taken to sarcastically fuming everywhere we go, "just want a _proper_ breakfast, some beans and grilled tomatoes and horrid meat."

Turns out I incepted myself, so when we saw an _English breakfast pack_ in Lidl I insisted we get it and live as the locals do.

![]({{ "/assets/posts/2022-edinburgh/proper-breakfast.moz80.jpg" | url }})

<p class="figcaption">It actually wasn't half bad. I had Julie not tell me what haggis was until after we'd finished.</p>

The local specialty soda is Irn Bru, which tastes like 80% orange cream soda and 20% the medicinal spices of Red Bull. I think if I grew up here I'd love the stuff.

![]({{ "/assets/posts/2022-edinburgh/irn-bru.moz80.jpg" | url }})

### Interlude on Being "Into Food"

One issue we are continuously balancing as we travel is how much to _critique_ what we eat vs just enjoy it.

![]({{ "/assets/posts/2022-edinburgh/cake-scoop.moz80.jpg" | url }})

<p class="figcaption">Assessment at work.</p>

When you order cake, and you've baked as many cakes as Julie has, do you analyze the moisture content (low), flavoring (peach, OK), crumb structure (loose), and topping (buttercream; grainy)?

Or do you just, you know, enjoy your cake?

If you're at a restaurant and everything is great, I think dissecting the experience can enhance it. I find there's always a lot of stuff going on technically and flavor-wise that takes a conversation and two tasters to tease out.

But, inevitably, if you're in that habit, then every meal---even one you cook---becomes an assessment, an opportunity for disappointment.

No stunning conclusion here, just---hey, sometimes it's good to remember to _enjoy your pizza._

![]({{ "/assets/posts/2022-edinburgh/julie-pizza.moz80.jpg" | url }})

<p class="figcaption">Beer helps.</p>

## In Praise of Lidl

Claim: **You should be able to buy good cheap groceries.** This should be an aim of society.

I didn't realize how cheap groceries could be until we went to this budget store called Lidl. It was the cheapest groceries I have ever seen.[^grocery] This should already be a bit surprising, because the UK is not a cheap place. But the real kicker is, the quality was completely decent! I'm talking like, fruits and vegetables that were as good or better than midrange grocery stores I'm used to in Seattle (Safeway, QFC), but at a fraction of the cost.

[^grocery]: Cheapest groceries I've seen in like a Western brick and mortar grocery store, let's say.

They seem to achieve this by inventing a massive array of knockoff brands, and adhering to minimal store upkeep (shelving is just huge piles of goods in boxes, kind of like at Costco but without needing to by 24-packs).

{% img [
    [
        "/assets/posts/2022-edinburgh/lidl-cereal-2.moz80.jpg",
        "/assets/posts/2022-edinburgh/lidl-cereal.moz80.jpg",
        "/assets/posts/2022-edinburgh/lidl-croissant.moz80.jpg"
    ],
    [
        "/assets/posts/2022-edinburgh/lidl-granola.moz80.jpg",
        "/assets/posts/2022-edinburgh/lidl-oreos.moz80.jpg",
        "/assets/posts/2022-edinburgh/lidl-sauce.moz80.jpg"
    ],
    [
        "/assets/posts/2022-edinburgh/lidl-aperol.moz80.jpg",
        "/assets/posts/2022-edinburgh/lidl-basil.moz80.jpg"
    ]
] %}

<p class="figcaption">The first time we went, I asked the guy at the checkout if we had to sign up for some kind of membership or like... if we could really just pay these prices. It felt too good to be true.</p>

Lettuce, e.g., came still attached to the roots and a clod of dirt. Beautiful, and stayed fresh for days. As for knockoff brands? Who cares! I mean, if you care, no problem, go buy the real thing elsewhere for a _multiplier_ of the price. But it's wonderful that _39p_ pasta sauce and _67p_ potted basil simply exist.

It makes me wonder how long ago groceries were this cheap at everyday stores in the States, and whether you can find this anywhere today besides Costco.

## Favorite Little Things

At the Brass Monkey, fav local pub, trying a couple IPAs before ordering. "Pretty good," I offered. Bartender replied, "yeah, and it's 5.4%, but you can't even taste it!"

I pause. I am confused. For me, this is squarely a weak beer. IPAs at home usually clock in 6.5%--7.0%, sometimes considerably higher. Heavy hitters go past 8%, 9%+. I probably said something like, "Wow!"

"Yeah," she continues, "my boyfriend drinks this, so I always win at board games."

Huh.

"Wow!"[^bigbeer]

[^bigbeer]: One concession to this beer strength thing is that the standard pint pour is a bit larger here: 19.2 U.S. fl oz (vz a U.S. pint = 16 U.S. fl oz). Notice _U.S._ fl oz. There is also _Imperial_ fl oz, which is what's used in Britain. One British pint = 20 Imperial fl oz = 19.2 U.S. fl oz. I'm happy to report that this may have been the only completely new unit I encountered.

---

{% img "/assets/posts/2022-edinburgh/creative-water.moz80.jpg" %}

<p class="figcaption">
This landscaping outside of the Scottish National Gallery of Modern Art. You immediately want to go hang out there. Kids (and I) loved running up and down the terraces.
</p>

---

Actual people playing cricket.

---

![]({{ "/assets/posts/2022-edinburgh/water-reflection.moz80.jpg" | url }})

<p class="figcaption">
The bizarre reflecting area in this pond in the botanical garden.
</p>


---

![]({{ "/assets/posts/2022-edinburgh/frog-death.moz80.jpg" | url }})

<p class="figcaption">
This ad where a frog meets its horrid demise next to a couple casually dining.
<p>

---

![]({{ "/assets/posts/2022-edinburgh/traffic-hat.moz80.jpg" | url }})

<p class="figcaption">
The quiet dignity of this statue man despite circumstances. Somehow seemed symbolic. Could not quite put finger on why.
</p>


---

![]({{ "/assets/posts/2022-edinburgh/the-filling-station.moz80.jpg" | url }})

<p class="figcaption">
Latest addition to my <span class="i">America Abroad</span> collection: a restaurant serving American classics they decided to name <span class="tracked">THE FILLING STATION</span>.
</p>

---

The words "to let" are used exclusively here in place of phrases we use in the States like "lease" or "rent." The signs are ubiquitous and typographically presented in such a way that an "I" could slip perfectly between the "O" and "L," and it's a good indicator that my twelve-year-old brain is still alive and well that I simply saw this as <span class="tracked">TOILET</span> everywhere.

{% img [[
    "/assets/posts/2022-edinburgh/to-let-1.moz80.jpg",
    "/assets/posts/2022-edinburgh/to-let-2.moz80.jpg",
    "/assets/posts/2022-edinburgh/to-let-3.moz80.jpg"
]] %}

<script src="https://player.vimeo.com/api/player.js"></script>
