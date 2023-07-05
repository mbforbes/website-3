---
title: "Calorie Counting × Meal Planning"
date: 2019-11-26
tags: "health"
image: /assets/posts/calorie-counting-meal-planning/header.png
---

![](/assets/posts/calorie-counting-meal-planning/header.svg)

I made a really simple calorie counting × meal planning web app. It’s open-source, and you can use it [here](https://github.com/mbforbes/food) if you’d like (not for the faint of heart). Following it worked pretty well for me—I was able to lose fat, save money, and learn to cook some new things.

But hold on. Calorie counting? Meal planning? Yes, this post is about fat loss.[^1] This side project isn’t really on-brand for me, so I wanted to write everything out in one go. What follows is my brain dump on calorie counting, meal planning, and the resulting little app I made to help me out. While it's not flashy or exciting, I admit it's the only app I’ve made that I actually use on a day-to-day basis.

### Disclaimer

An honest take on the science of food and nutrition seems to be: _we have no idea what’s going on._ And yet of course the internet and bookstores are filled with diets and exercise plans. There’s a lot that works for many people, and a lot that doesn’t. Take everything I write with a Samin Nosrat helping of salt.[^2]

## Losing fat

My goal was to lose some fat.

Losing fat seems both potentially quite simple, but at the same time extremely challenging for myriad reasons that may be different for each person. And though it’s a fascinating topic, fat loss seems to have suffered from years of bad information and tabloid-level expertise,[^3] making it both slightly uncomfortable to discuss, yet somehow critical to both shallow ideas of beauty and seemingly legitimate effects on one’s health.[^4]

## Why food?

If you consume American media, it’s hard not to think that exercise is the key to achieving a fit body. On TV, you’re bombarded with videos of beautifully sweaty athletes, pumping their gleaming bodies around to the latest beats, rocking the freshest sportswear and headphones. (And right after, you’ll probably see ads for pizza, soda, and beer.) [^5]

I remember seeing a graph a while ago that I can’t find, so I’ve made one that expresses the same idea:

![Bar graph comparing calorie intake with food vs spending with exercise](/assets/posts/calorie-counting-meal-planning/diet-vs-exercise.svg)

<p class="figcaption i">
With food, you control calories from roughly 1800 - 3500 per day, but with exercise, you only control 200 - 400.
</p>


This idea changed how I thought about fitness. The simple reality is that you control vastly more calories through what you eat than what you burn through exercise.[^6]

And so it turns out that food, not exercise, is actually paramount in losing fat.

This was annoying for me to realize. While I’d liked exercising and learning new sports over the years, I’d never had that much interest in cooking or choosing what I eat. (In hindsight, this is probably why I ended up with a bit more fat than I’d like.)

Is exercise still important? It seems to be. You don’t want your muscles to atrophy, and you probably want them to even grow a bit. And exercise seems to help your mood, sleep, thinking, longevity, and mental health in all kinds of difficult-to-measure ways.

But let’s be clear: exercise takes a back seat to food in the quest of consuming fewer calories than you burn. There’s just no contest.

Is losing fat as simple as consuming fewer calories than you burn? Aside from lifting weights sometimes to keep your muscles, I think so. I might be wrong. You can read a lot about this on the internet, but consuming fewer calories than you burn seems to be an overwhelmingly reasonable approach to losing fat. The strongest case against this is the idea that your body adjusts to needing fewer calories when you feed it less—but if this is true, the effect seems to be small.

## Counting calories

![A picture of San Pellegrino with a splash of aperol.](/assets/posts/calorie-counting-meal-planning/bubbles.jpg)

<p class="figcaption i">
San Pellegrino with a splash of aperol. My friend Woody correctly observed that buying water in a bottle shipped from Italy is stupid given access to clean and nearly free tap water. But I maintain it's a great treat substitute for a beer.
</p>


Once you’re on board with calories in vs calories out, the natural next step is to try to figure out what your numbers are. I used some calculators to see my ballpark basic metabolic rate and about how much I was burning with exercise. Then you do the subtraction game. And then you eat that much.

A side note on counting calories: counting calories is so interesting! It’s an ultra-pragmatic lens through which to view food. Through it, things you thought were bad aren’t, and vice versa. Bacon? Wow, not so bad. A bagel and cream cheese? Holy cow, I don’t have the budget for that. I don’t claim that this is the whole story on nutrition, but it’s certainly a useful one.

One my favorite illustrations of calorie amounts was on the website ss.fitness. One medium Dairy Queen blizzard—1050 calories—is equivalent to fifteen eggs. Fifteen! Imagine that for dessert.

To me, the idea of _counting calories_ still sounds obsessive and insane. A few years ago, I never imagined I would ever do it, much less advocate for it. But it makes such a difference in guiding your eating during a diet. It’s like navigating with the lights on.

Here’s an example of the difference. Say it’s 4pm and you get hungry. If you’re counting calories with a plan, you know exactly what your budget is. This makes it easier to say, “I kind of want a snack… but actually, I know I’m going to hit my calorie numbers with dinner, I can just have some fizzy water and switch gears at work.” Or you might have a light snack: maybe half an apple (~50 calories) and some black decaf (~0 calories).

If instead you were just vaguely trying to eat healthier, it’s easy to think, “I’ll just have a small handful of nuts, that feels pretty healthy.” You grab a 1/2 cup of cashews, which ends up being as much as a workout (~360 calories) and can easily erase your progress for the day.

Once you’ve decided to count your calories, you enter this challenge of figuring out the calorie content of literally every single thing you put in your mouth. If you cook your food, this is a bit annoying, but gets much easier once you’ve looked up your ingredients a couple times. For eating out, it can be almost impossible, at least until you’re really good at estimating.

So cooking seems like the right way to go for counting calories. You have much more control. But wait, does this mean cooking all your food?

## How do you get your food?

If you’re with me so far, food choice is paramount to losing fat. And if you’re determined to lose fat and don’t want the guesswork, counting calories gives you total control.

But you’re a human being with money and time to manage. When I thought about getting my food, I really had three goals: cheap, fast, and healthy. Could I get all three at once?

![A venn diagram showing healthy, fast, and cheap meal prep options.](/assets/posts/calorie-counting-meal-planning/food-venn.svg)

<p class="figcaption i">
Only meal prepping hit all three marks of cheap, fast, and healthy.
</p>



This surprised me.

- **Cheap:** If you’re frugal by habit or necessity, it seems like you really have two options: cook or eat fast food. Cooking your own food can be unbelievably cheap. And if you’re limiting your calorie intake, fast food is not your friend.

- **Healthy** If you eat food prepared by others, it’s difficult, but possible, to control your calorie intake. Restaurants usually have some healthy dishes, and occasionally even calorie estimates. Meal kit subscriptions I’ve tried also score good marks here. But of course, both restaurants and meal kit subscriptions are an order of magnitude more expensive than cooking.

- **Fast:** I’m constantly trying to do more things than I probably have time for. While cooking all of your meals right before you eat them is cheap and lets you control your calorie intake exactly, it takes a huge amount of time. I found that between cooking and cleaning up, making breakfast, lunch, and dinner for myself before each meal took almost all of my free time. Meal kit subscriptions don’t quite fit the bill because they target cooking a meal you’ll eat right then, not cooking in bulk in advance.

It seems that the only answer here is to _meal prep_. Plan out your meals in advance to hit specific calorie requirements, and cook some of them in bulk in advance. Cheap, fast, and healthy.

But I want to highlight one point about meal prepping I found to be absolutely critical.

## Planning calories in advance

**Advance meal planning front-loads your decision making, which makes it so much easier to stay on track with calorie goals.** I really can’t emphasize enough the enormous difference this makes.

Advanced calorie planning is so helpful because you don’t want to make decisions about what to eat when you’re hungry. If you’re like me, you don’t have much useful experience with the sensation of hunger.[^7] When you’re hungry, you fix that problem. You have a hard time regulating your emotions and actions when you’re hungry. And if you’re trying to lose fat, you’re going to start feeling hungry more often. Being hungry and making decisions about what to eat taxes your willpower like crazy.

With meal prepping, you can make all of your meal decisions in advance. Say you plan your meals during the weekend and cook some of them in advance to save time. Then, during the week, you just eat that food. No decisions, just eat that food.

If you get hungry sometimes, that’s OK. Having a bit of background hunger becomes much more tolerable when you know where you’re at calorie wise. At first, it feels wrong and awful to be hungry. You may have gone your entire life without feeling the sensation of hunger and just sitting with it. But the crazy thing is, it’s not that bad.[^8] You can handle a lot more of this than you think. And it gets better with some practice.

Having a meal plan, and knowing calorie amounts, also helps guide your decisions when you do decide to deviate. You can choose smaller treats, or compensate for them with your meals.

### Satiety

But wait, it’s not all about being hungry. I found that calorie counting forced me to develop an understanding of which foods made me feel more full for longer.

With no rules on what you can eat aside from hitting calorie goals[^9], you quickly discover what makes you feel full for longer. A breakfast of buttered toast left me famished by 10:45am, but with a scramble of eggs and vegetables, I’d feel comfortably full until lunchtime.

Dealing with hunger, then, was kind of a natural feedback mechanism for screwing up food choices.

![A cup full of chicken](/assets/posts/calorie-counting-meal-planning/chicken-cup.jpg)

<p class="figcaption i">
Sometimes you just need a cup full of chicken.
</p>

## The method

In service of losing fat, count calories. In service of counting calories and your money, cook your own food. In service of actually sticking to your calorie plan, plan your meals in advance. And in service of your time, cook some dishes in bulk.

Simply put, this means combining calorie counting with meal planning.

## Calorie counting × meal planning

I originally began my meal planning with a spreadsheet. Looking up the calories for each ingredient is both hugely annoying and hugely informative. One of my earlier sheets looked like this:

![A screenshot of an early calorie counting spreadsheet I used.](/assets/posts/calorie-counting-meal-planning/spreadsheet-small.png)
<p class="figcaption i">
I don't think I had all of the colors originally.
</p>

I think it’s helpful to have an early phase of looking up calories on your own, especially if you’re thinking about eventually using a service that does it for you. I can’t imagine anyone would like to count calories or pay for a meal planning subscription forever. But doing it manually for a few days or weeks gives you all kinds of surprising moments, as I mentioned above about Dairy Queen vs eggs. For the first time, you have an apples-to-apples tool to compare apples and oranges.[^10] More importantly, having a basic background understanding of calorie counts will serve you in the tens of thousands of decisions you make for the rest of your life. After all, we eat every day.

But when your hammer is programming, repetitive tasks look like nails. I was looking up the same ingredients multiple times. I’d copy and paste meals I had already put together. I’d manually look through the week to compile a grocery list. I wished I had an inventory of the meals I liked to cook, and the calories for common ingredients. If only I could automate some parts of this…

### Calorie counting apps

I eventually looked up calorie counting apps. Would they help me meal plan with calories in mind?

No. The calorie counting apps I found solve the wrong problem. **Calorie counting apps expect you to record calories as you eat them.** Though some had limited features for advance planning, it was the exception rather than the expected workflow. But this is exactly backwards for the easiest way to meet calorie goals. If I was trying to figure out how many calories something was at the time I was eating it, it was already too late.

Instead, I specifically wanted to plan, in advance, all of the meals I’d eat for the week, along with their calorie amounts. Then, I’d shop, cook, and eat.

If you’re planning your meals in advance, then tracking your calories for every meal in an app _when you eat the meal_ is completely pointless. At best, you have to constantly type every damn thing into the app. At worst, this will keep you painfully aware of past failures.

Another problem is that the calorie counts apps that give for foods vary widely. If you’re in a significant caloric deficit, this is a huge deal. Being off by even 200 calories over the course of several meals is the difference between being slightly hungry and absolutely tortured. Some apps seem to assume you use cooking oil in preparing some food, which leads to huge variations because oil is so calorie dense. Plus, many apps crowdsource their calorie counts, which leads to all sorts of garbage like calorie counts for “1 caesar salad,” which in reality could be anywhere from 200 – 2000.[^11]

In addition to not doing what I wanted, it felt like calorie counting apps do way too much other stuff.  Exercise tracking, sleep logging, sensor integration, weight loss graphs, built-in journal, and so on. For some, this may be fun. But I only wanted to plan and eat my meals.

### Meal planning apps

If your goal is counting calories, you might not think to Google a different set of keywords. But the approach closer to what I wanted is “meal planning.”

So, what about meal planning apps? They have the opposite problem: they don’t have any interest in calorie counting. Calories often aren’t available at all. When they are, they’re often estimates, and are never shown per-ingredient. You can’t afford guesswork when you really care about hitting numeric goals. Knowing calories per-ingredient is vital when you want to make a bigger meal or make it more satiating. As soon as you have to tweak something yourself, you need to break back out into a spreadsheet.

The few apps that I saw that attempted to be hybrids (both calorie counting and meal planning) made it tough to customize what you eat, add your own recipes, or cook in bulk. It felt like these apps try to do as much automation as possible, sacrificing control.

This sounds like I’m griping over minutae, but I challenge you to follow an app that prescribes you “2 tbsp peanut butter” for lunch and not start gnawing at your potted plants by 3:30.

The final factor is money. Call me stingy, but when my calorie counting and meal planning were going pretty well with spreadsheets, it felt absurd to pay a subscription (they’re nearly all subscription-based) for an app that did almost the same thing, and left me without the control I wanted.

### Interlude: apps translating Japanese menus

This is off topic but I can’t resist.

![Picture of bad menu translation labeling buttered toast as hot sand](/assets/posts/calorie-counting-meal-planning/hot-sand.jpg)

<p class="figcaption i">
I can't believe it's not sand!
</p>


## What should a calorie counting × meal planning app do?

Recap: calorie counting apps suck for meal planning, meal planning apps suck for calorie counting.

Now enters the part where we figure out what we actually want from an app.

As I began to make meal plans, first with spreadsheets, and then with early versions of my app, a few realities revealed themselves to me:

1. **I don’t actually cook that many different dishes.** I’d like to think that I do, but twenty-one meals per week is a lot to cook. Even if I’m cooking a new dish or two every week, that means most meals will be repeats. Plus, you repeat dishes a lot when cooking in bulk. So a key feature is defining and saving meals.

2. **Accurate calorie info is vital.** When you’re eating less, food is precious. You don’t want to eat too much because you care about losing fat. But you _really_ want to eat all of your allowance. This means, at least once, looking up each thing I eat. I use the nutrition label whenever possible, and cross-reference four or five websites for meats or produce.

3. **Looking up calories is a pain in the ass.** I really want to do it just once, which also means the app should be able to do basic unit conversions.

4. **Might as well generate a grocery list.** I would meal plan and then immediately shop, so I’d might as well make it easy to get a list of what I need. And I don’t want it telling me to buy salt or oil every week, so I’d like a separate section for food I have in bulk.

… and that’s pretty much it. So, without further ado:

## Voila

The main view of the web app looks like this:

![](/assets/posts/calorie-counting-meal-planning/preview-edit.png)

The dishes are on the right, and you drag and drop them into the meal slots for the upcoming week:

![](/assets/posts/calorie-counting-meal-planning/dnd-add-dish.gif)

There’s a calorie bank that looks up the components for each dish. And it’s easy to split a dish into multiple servings, allowing you to cook in bulk while still tracking calories:

![](/assets/posts/calorie-counting-meal-planning/chili-complete.png)

At the bottom, a grocery list is generated, along with a little meal prep checklist:

![](/assets/posts/calorie-counting-meal-planning/small-grocery-preview.png)

The app is super rough around the edges. You have to edit data (`.json`) files by hand to add ingredients or dishes. Here’s the chili from above:

```json
"chili": {
    "title": "Chili",
    "mealHint": "dinner",
    "ingredients": [
        "1 tbsp olive oil",
        "2 lbs ground beef (90% lean)",
        "1 onion",
        "6 cloves garlic",
        "2 can diced tomatoes",
        "24 oz tomato sauce",
        "0.5 cup beef broth",
        "2 tbsp chili powder",
        "2.5 tsp cumin",
        "2 tsp paprika",
        "2 tsp cocoa powder",
        "1 tsp sugar",
        "0.5 tsp coriander",
        "30 oz kidney beans"
    ],
    "img": "img/chili.png",
    "recipe": "cookingclassy.com/slow-cooker-chili/",
    "recipeServings": 5
},
```

There’s no logging in, so there’s no user accounts or databases or anything. You have to run the app by starting a web server on your computer (fortunately this is just one line of code). Oh, and it’s not mobile friendly at all.

But with all that said, it’s the first app I’ve made that I actually use every week. If you download it, you’ll find dozens of dishes and weeks tucked away. You know, in case you want to know what I had for dinner on September 15th.

## That’s it

Thank you for making it all the way through this lengthy diatribe on calorie counting, meal planning, and my tiny meal prepping app.

I started this post because I finished the app as a side project, and it seemed like the app needed some context for why it exists at all. To be honest, I would be shocked (but delighted) if the app is ever used by another person.

Instead, my hope is that someone in the cognitive ballpark of wanting to lose fat will find something in this post that’s helpful or useful to them, and it will aid them in their journey.

## Epilogue

After several months of counting calories and losing some fat, I found my perspective on a few things changed. I mentioned some of these in passing above, but to put them all in one place:

- **Satiety** — Some foods are really good at making me feel full for longer with fewer calories than others. Good examples: eggs, broccoli, chicken. Bad examples: cocktails, fettuccini alfredo, potato chips.[^12]

- **Hunger** — You probably noticed this from above, but losing weight forced me to confront hunger in a way I never had before. It never felt OK to be hungry. I still don’t love being hungry, but I think I’m a bit more patient with it. Now, I realize that I’m not literally starving when I’m hungry. I’m just hungry.

- **Exercise** — Since I no longer tied exercise as closely to losing fat, I started to view exercise as being about my mental health. I paid more attention to how it made me feel afterward. It’s mind-boggling what a difference exercise seems to make in my perception of the world. It seems like even a small mood boost and decrease in stress can change the dozens of interactions I have with humans and my thoughts throughout the day.

- **Cooking** — After looking up a lot of calories and cooking a lot of food, some broad patterns emerged. The basic formula was to eat mostly protein and vegetables, and drink a lot of water. As I transition away from purely calorie counting and towards cooking for daily life, I’m starting to try to learn how to make food more delicious. Cooking so much has made me more interested in cooking well, which turns out to be a deep and wonderful world in its own right (news only to me).[^13]

## Further resources

- **[ss.fitness](http://ss.fitness)** — Advocates focusing on food and cooking your own meals. Lots of nice graphs and illustrations. I didn’t give any citations for my claims throughout this post, but this site provides hundreds of links to studies. Ultimately very helpful, though a bit annoying because the website is constantly redesigned and different pieces get randomly shuffled or locked behind paywalls.

- **Salt Fat Acid Heat** _by Samin Nosrat (Simon & Schuster, 2017)_ — Samin teaches you foundational cooking. I was looking for a book that teaches you about _how_ to cook, not just lists of recipes. And I didn’t want a chemistry book or history tome. This seems to strike a great sweet spot. Fun reading, and the few recipes I’ve tried at random have been shockingly great, even by my clumsy hand.

[^1]:	I consciously wrote “fat” throughout this post instead of “weight,” even though “losing fat” reads awkwardly. I think it’s be worth being honest when talking about this stuff. Nobody wants to lose their vital organs or bones. And I doubt many people want to lose their muscle. All those things are weight on your body. People want to lose fat.

[^2]:	A Samin Nosrat helping of salt: [https://youtu.be/HER4efpDCis?t=75](https://youtu.be/HER4efpDCis?t=75)

[^3]:	To which I, with no qualifications, submit my own treatise.

[^4]:	Allow me to present one more observation: in addition to beauty and health, at least in America, fat is also a socioeconomic symbol. Being skinny is a demonstration of class and status.

	There’s a big question I’m avoiding here: _should_ one lose fat? The hairy part is that people can’t distinguish which ideal you’re going for.

[^5]:	Conspiracy theory time: Wouldn’t a perfect corporate equilibrium be achieved if you were never in a state you liked? Drawn in one direction by high calorie foods and drinks, and drawn in the other by expensive exercise clothes and equipment, never quite becoming what you dream to look like. What if you were sold both the goal, and the processes that move you both towards and away from it? Hmmm. HMMMMMM.

[^6]:	Extreme exercise will burn an order of magnitude more calories, but isn’t the norm for us suckers with desk jobs.

[^7]:	I wish to point out that it’s a great blessing to have never had to worry about being hungry in my life.

[^8]:	I feel the need to explicitly point out that I only use “hunger” to mean the body sensation, and in the context of intentionally losing weight at a moderate pace. Completely separately, people use the word “hunger” to mean the issue of people needing food to survive and not being able to access it.

[^9]:	Speaking of having no rules on what you eat, check out [this Twinkie diet](https://www.cnn.com/2010/HEALTH/11/08/twinkie.diet.professor/index.html)

[^10]:	I couldn’t resist.

[^11]:	Just to demonstrate this, I recently looked up how many calories are in 3oz of pulled pork on several different websites, and I found: 195, 143, 171, 158, 283, 151, 160, 229, 172, and 143. Honestly, this is actually probably fair because it depends how much fat and muscle are in the portion you’re eating. But this kind of thing shows up all the time, even in more predictable foods.

[^12]:	I can polish off a whole bag of Baked Lays without blinking. For those of you that think Baked Lays is not a good potato chip, please get right out of town.

[^13]:	For better or for worse, I will have a hard time turning off my calorie counting instincts, such as when Amiel advises us to use a tablespoon of butter per egg: [https://youtu.be/BW1x6F63F80?t=172](https://youtu.be/BW1x6F63F80?t=172)
