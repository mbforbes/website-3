---
title: Ordinary least squares, ℓ² (ridge), and ℓ¹ (lasso) linear regressions
date: 2017-11-21
tags: research
---

## Preface

_I wrote this in 2017, and am posting it now in 2021. I was surprised how difficult it was to find complete information about linear regressions in one place: the derivations of the gradients, how they get their properties (e.g., lasso's sparsity requiring coordinate descent), and some simple code to implement them. I tried to be careful about vector shapes and algebra, but there are probably still minor errors, which are of course my own._

_One big goof I had was running this on MNIST, which ought to be treated as a classification problem per class (e.g., with logistic regression), rather than trying to regress each digit to a number (e.g., the digit "1" to the number `1`, and the digit "5" to the number `5`). I should have ran this code on a true regression dataset instead, where you do want real numbers (rather than class decisions) as output._

_However, the silver lining is that after this goof, I was in a computer architecture class where we needed to run MNIST classification on FPGAs, and the starter code had made exactly this same mistake---they were doing linear instead of logistic regression! Making that simple switch resulted in such an accuracy boost that the classifier became one of the pareto optimal ones._

_The repository for this project, which contains the full writeup below, as well as simple pytorch code to implement it, is here:_


{% include "programming-language-tooltips.njk" %}

{% set item = collections.software | selectAttrEquals(["data", "title"], "rndjam1") | first %}
{% include "software-long.njk" %}

_Enjoy!_

_-- Max from 2021_

## Goal

**Build** linear regression for MNIST from scratch using pytorch.

## Data splits

MNIST ([csv version][mnist-csv]) has a 60k/10k train/test split.

I pulled the last 10k off of train for a val set.

My final splits are then 50k/10k/10k train/val/test.

[mnist-csv]: https://pjreddie.com/projects/mnist-in-csv/


## Viewing an image

Here's an MNIST image:

![the first mnist datum]({{ "/assets/posts/regression-math/images/example_normal.jpg" | url }})

Here it is expanded 10x:

![the first mnist datum, expanded]({{ "/assets/posts/regression-math/images/example_bloated.jpg" | url }})


## Data loading: CSV vs binary ("tensor")

y-axis is seconds taken to load the file; lower is better. Result: binary is
way faster.

![data loading speeds, csv vs binary]({{ "/assets/posts/regression-math/images/data_loading.png" | url }})

## Naive regression to scalar

In this we regress each image to a scalar that is the number represented in
that image. For example, we regress the image <img alt="the first MNIST datum" src="{{ "/assets/posts/regression-math/images/example_normal.jpg" | url }}" class="inline ph2"> to the number `5`.

> Disclaimer: this is a suboptimal approach. If you're going to treat was is really a
> classification problem (like MNIST) as regression, you should regress to each
> class independently (i.e., do 10 regression problems at once instead of a
> single regression). Explaining why would take math that I would have to talk
> to people smarter than me to produce. I think the intuition is that you're
> making the learning problem harder by forcing these distinct classes to exist
> as points in a 1D real space, when they really have no relation to each
> other. This is better treated as a logistic regression problem.
>
> However: (a) if you're confused like I was, you might try it, (b) if you're bad at
> math like me, it's simpler to start out with a "normal" regression than 10 of
> them, (c) I'm kind of treating this like a notebook, so might as well
> document the simple &rarr; complex progression of what I tried.
>
> So here we go.

### Notation

Definitions:

![definitions]({{ "/assets/posts/regression-math/svg/definitions.svg" | url }})

Math reminders and my notation choices:

![math reminders]({{ "/assets/posts/regression-math/svg/math-reminders.svg" | url }})

> NB: While the derivative of a function **f** : ℝ<sup>n</sup> &rarr; ℝ is
> [technically a row
> vector](https://en.wikipedia.org/wiki/Jacobian_matrix_and_determinant),
> people&trade; have decided that gradients of functions are column vectors,
> which is why I have transposes sprinkled below. (Thanks to Chris Xie for
> explaining this.)

### Ordinary least squares (OLS)

**Loss** (average per datum):

![least squares loss]({{ "/assets/posts/regression-math/svg/least-squares-loss.svg" | url }})

Using the average loss per datum is nice because it is invariant of the dataset
(or (mini)batch) size, which will come into play when we do gradient
descent. Expanding the loss function out for my noob math:

![least squares loss expanded]({{ "/assets/posts/regression-math/svg/least-squares-loss-expanded.svg" | url }})

Taking the **derivative** of the loss function with respect to the **weight
vector**:

![least squares loss expanded derivative]({{ "/assets/posts/regression-math/svg/least-squares-loss-expanded-derivative.svg" | url }})

We can set the gradient equal to 0 (the zero vector) and solve for the
**analytic solution** (omitting second derivative check):

![least squares analytic expanded]({{ "/assets/posts/regression-math/svg/least-squares-analytic-expanded.svg" | url }})

Doing a little bit of algebra to clean up the gradient, we'll get our
**gradient for gradient descent**:

![least squares gradient]({{ "/assets/posts/regression-math/svg/least-squares-gradient.svg" | url }})

We can plot the loss as we take more gradient descent steps:

![ols gradient descent linear plot]({{ "/assets/posts/regression-math/images/ols_gd_linear.png" | url }})

... but it's hard to see what's happening. That's because the loss starts so
high and the y-axis is on a linear scale. A log scale is marginally more
informative:

![ols gradient descent log plot]({{ "/assets/posts/regression-math/images/ols_gd_log.png" | url }})

To instead do **coordinate descent**, we optimize a single coordinate at a
time, keeping all others fixed. We take the **derivative** of the loss function
with respect to a **single weight**:

![least squares derivative single weight]({{ "/assets/posts/regression-math/svg/least-squares-derivative-single-weight.svg" | url }})

Setting the derivative equal to zero, we can solve for the optimal value for
that single weight:

![least squares derivative single weight zero]({{ "/assets/posts/regression-math/svg/least-squares-derivative-single-weight-zero.svg" | url }})

However, this is an expensive update to a single weight. We can speed this up.
If we define the residual,

![residual]({{ "/assets/posts/regression-math/svg/residual.svg" | url }})

then we can rewrite the inner term above as,

![least squares residual rewrite]({{ "/assets/posts/regression-math/svg/least-squares-residual-rewrite.svg" | url }})

and, using `(t)` and `(t+1)` to clarify old and new values for the weight,
rewrite the single weight optimum as:

![least squares coord descent]({{ "/assets/posts/regression-math/svg/least-squares-coord-descent.svg" | url }})

After updating that weight, **r** is immediately stale, so we must update it as
well:

![least squares coord descent r update]({{ "/assets/posts/regression-math/svg/least-squares-coord-descent-r-update.svg" | url }})

We can compute an initial **r** and we can precompute all of the column norms
(the denominator) because they do not change. That means that each weight
update involves just the _n_-dimensional vector dot product (the numerator) and
updating **r** (_n_-dimensional operations). Because of this, one full round of
coordinate descent (updating all weight coordinates once) is said to have the
same update time complexity as one step of gradient descent (`O(nd)`).

However, I found that in practice, one step of (vanilla) gradient descent is
much faster. I think this is because my implementation of coordinate descent
requires moving values to and from the GPU (for bookkeeping old values),
whereas gradient descent can run entirely on the GPU. I'm not sure if I can
remedy this. With that said, coordinate descent converges with 10x fewer
iterations.

![ols coordinate descent plot]({{ "/assets/posts/regression-math/images/ols_cd.png" | url }})

But how well do we do in regressing to a scalar with OLS?

![ols accuracy]({{ "/assets/posts/regression-math/images/ols_acc.png" | url }})

Not very well.

### Ridge regression (RR)

**Loss:**

![ridge loss]({{ "/assets/posts/regression-math/svg/ridge-loss.svg" | url }})

> NB: For all regularization methods (e.g., ridge and lasso), we shouldn't be
> regularizing the weight corresponding to the bias term (I added as an extra
> feature column of `1`s). You can remedy this by either (a) centering the `y`s
> and omitting the bias term, or (b) removing the regularization of the bias
> weight in the loss and gradient. I tried doing (b) but I think I failed (GD
> wasn't getting nearly close enough to analytic loss), so I've left the
> normalization in there for now (!).

**Derivative:**

(Being a bit more liberal with my hand waving of vector and matrix derivatives
than above)

![ridge derivative]({{ "/assets/posts/regression-math/svg/ridge-derivative.svg" | url }})

**Analytic:**

> NB: I think some solutions combine _n_ into _λ_ because it looks cleaner. In
> order to get the analytic solution and gradient (descent) to reach the same
> solution, I needed to be consistent with how I applied _n_, so I've left it
> in for completeness.

![ridge analytic]({{ "/assets/posts/regression-math/svg/ridge-analytic.svg" | url }})

**Gradient:**

(Just massaging the derivative we found a bit more.)

![ridge gradient]({{ "/assets/posts/regression-math/svg/ridge-gradient.svg" | url }})

**Coordinate descent:**

The derivative of the regularization term with respect to a single weight is:

![ridge cd 0]({{ "/assets/posts/regression-math/svg/ridge-cd-0.svg" | url }})

with that in mind, the derivative of the loss function with respect to a single
weight is:

![ridge cd 1]({{ "/assets/posts/regression-math/svg/ridge-cd-1.svg" | url }})

In setting this equal to 0 and solving, I'm going to do some serious hand
waving about "previous" versus "next" values of the weight. (I discovered what
seems (empirically) to be the correct form by modifying late equations of the
Lasso coordinate descent update, but I'm not sure the correct way to do the
derivation here.) We'll also make use of the residual
![residual]({{ "/assets/posts/regression-math/svg/residual.svg" | url }}).

![ridge cd 2]({{ "/assets/posts/regression-math/svg/ridge-cd-2.svg" | url }})

As above, we update the residual after each weight update:

![residual update]({{ "/assets/posts/regression-math/svg/residual-update.svg" | url }})

### Lasso

**Loss:**

![lasso loss]({{ "/assets/posts/regression-math/svg/lasso-loss.svg" | url }})

**Derivative:**

![lasso derivative part 1]({{ "/assets/posts/regression-math/svg/lasso-derivative-part1.svg" | url }})

Focusing on the final term, we'll use the subgradient, and pick `0` (valid in
`[-1, 1]`) for the nondifferentiable point. This means we can use `sgn(x)` as
the "derivative" of `|x|`.

![lasso derivative part 2]({{ "/assets/posts/regression-math/svg/lasso-derivative-part2.svg" | url }})

Substitute in to get the final term for the (sub)gradient:

![lasso derivative part 3]({{ "/assets/posts/regression-math/svg/lasso-derivative-part3.svg" | url }})

> NB: There's no soft thresholding (sparsity-encouraging) property of LASSO
> when you use gradient descent. You need something like coordinate descent to
> get that. Speaking of which...

**Coordinate descent:**

![lasso cd 1]({{ "/assets/posts/regression-math/svg/lasso-cd-1.svg" | url }})

setting this = 0, and again using the residual ![residual]({{ "/assets/posts/regression-math/svg/residual.svg" | url }}),
we have:

![lasso cd 2]({{ "/assets/posts/regression-math/svg/lasso-cd-2.svg" | url }})

> NB: I think that here (and below) we might really be saying that 0 is in the
> set of subgradients, rather than that it equals zero.

There's a lot going on. Let's define two variables to clean up our equation:

![lasso cd 3]({{ "/assets/posts/regression-math/svg/lasso-cd-3.svg" | url }})

From this, we can more clearly see the solution to this 1D problem:

![lasso cd 4]({{ "/assets/posts/regression-math/svg/lasso-cd-4.svg" | url }})

This solution is exactly the soft threshold operator:

![lasso cd 5]({{ "/assets/posts/regression-math/svg/lasso-cd-5.svg" | url }})

Rewriting this into its full form:

![lasso cd 6]({{ "/assets/posts/regression-math/svg/lasso-cd-6.svg" | url }})

As with coordinate descent above, we need to update the residual **r** after
each weight update (skipping the derivation; same as above for OLS):

![residual update]({{ "/assets/posts/regression-math/svg/residual-update.svg" | url }})

## Links

- [Table of regularized least squares functions (Wikipedia)](https://en.wikipedia.org/wiki/Regularized_least_squares#Partial_list_of_RLS_methods)
- [The Matrix Cookbook (Petersen & Pedersen)](https://www.math.uwaterloo.ca/~hwolkowi/matrixcookbook.pdf)
- [OLS with matrices notes (possibly Rosenfeld?)](https://web.stanford.edu/~mrosenfe/soc_meth_proj3/matrix_OLS_NYU_notes.pdf)
- [Coordinate Descent (Gordon & Tibshirani)](https://www.cs.cmu.edu/~ggordon/10725-F12/slides/25-coord-desc.pdf)
- [A Coordinate Descent Algorithm for the Lasso Problem (Chi)](http://jocelynchi.com/a-coordinate-descent-algorithm-for-the-lasso-problem)
- [Deriving the lasso coordinate descent update (Fox)](https://www.coursera.org/learn/ml-regression/lecture/6OLyn/deriving-the-lasso-coordinate-descent-update)

## Acknowledgements

Many thanks to Chris Xie and John Thickstun for helping me out with math. All errors are my own.
