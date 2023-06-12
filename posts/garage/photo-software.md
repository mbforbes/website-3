---
title: Software
date: 2023-06-10
series: Photo Notebook
---

## Apple Photos

Apple Photos is simultaneously a blessing and a bane.

The interface for viewing and editing photos is extremely fast and easy to use. Try Google Photos in comparison. There's no chance of me switching.

The basic edits also work well. I notice in particular that the auto-enhance is usually quite good, and the shadows slider is tasteful.

Minor issues such as crashing when trying to make an album out of a bunch of photos have happened to me several times. But while stupid,^[I'm pretty sure the issue is in rendering the little thumbnail previews for the images that you're dragging.] because I can work around them (just restarting to clear out RAM), they don't really worry me.

What is ruiniously bad is the cloud functionality.^[This is aside from all the normal confusions with Apple Photos on iCloud, which have confused multiple old people I've talked to with disappearing and duplicate photos.] An amount of data that should upload in a few minutes takes hours, or literally days. It won't start uploading for an indeterminate amount of time, and will barely give any indication of progress.

This alone would be frustrating but tolerable. I now leave my uploads to happen overnight, forcing my Mac to stay awake.

But the worst is the combination of the slow cloud with the fact that it has the following bug: if you edit photos before they upload, they will become blurry in the library, and will permanently fail to upload. No amount of coaxing can recover the photos when this happens. The only workaround is to export the photo originals, delete them from your photo library, then delete them from the trash, then freshly import the photos again, don't touch them, and hope that they upload.

This means that I can't edit my photos when I import them. I have to mandate myself an overnight waiting period. This is technically OK, but it's frustrating. It's easy to import then not revisit, lengthening the queue of photos to check out and increasing the odds of dumping and procrastinating.

I never had these issues with iPhone photos. But with 85MB DNG files, I now have them every time.

## Photomator

Everyone loved Pixelmator, so I tried Photomator, their Lightroom alternative that was just released.

I've encountered several bugs so far, both from the program on its own, as well as via its edges w/ Apple Photos. The biggest has been around the issue of making edits to photos before they're uploaded: edits simply won't show up. I suspect this could be Apple's fault, related to their bugs described above.

The things it lets you do that Apple Photos doesn't are:
- apply edits over subsets of the photo (e.g. to a gradient)
    - select these subsets using ML
    - layer these edits on top of each other
- view cropping dimensions

Plus, it has sliders that have different settings and wider ranges than Apple Photos. You can do more with them. (E.g., a slider will go to 200%, which is something you might actually want with a RAW photo.)

There are minor drawbacks, like:
- The UI is worse than Apple Photos
    - e.g., cropping is clicking and dragging rather than trackpad scrolling and pinching
    - e.g., enabling / disabling sections of edits makes them jump around, which means you can't quickly toggle them on / off to see what effect they have
- The presets (_auto enhance_) are worse than Apple Photos
- Features like "increase resolution" and "denoise" seem---confoundingly---to do absolutely nothing all the times I've tried them
- There's constantly a dialog that Apple interjects every time you want to save a photo^[I'm sure this is something they have to live with for now and are pleading Apple to allow users to disable.]

But biggest drawback, aside from the bugs, has been that there isn't a good way to continue the editing process when the ML tools don't work perfectly. Which, because they're ML tools, they don't.

One example is selecting the sky. Because the exposure for the sky is usually vastly different than everything else, I almost always want to edit a photo in two sections: (1) sky, (2) not-sky (everything else). They have an ML "select sky" tool. Awesome. But it usually misses stuff, like sky that's disconnected from the main part of the sky, like in between tree leaves or around buildings. Or, it grabs too much, like a sky reflection in a building. When it fails, you're left to hand-brush selections. But, for something like in-between the leaves of a tree, this is prohibitively tedious. My wish in this case is that there were recovery / cleanup tools for when the ML doesn't get it perfectly right, like smart / interactive fills.

The feature I wish most that it had was an HDR merge feature. Right now I'm not doing any exposure bracketing shots because I lack software to merge them. I'm very surprised that I want this, because I never thought about it before using a real camera. But the wildly different sky / non-sky exposures for almost every photo beg for it.

I wish I could be using Photomator like a year into its release. Maybe they would have fixed the bugs, added workflows to support imperfect ML, and implemented stuff like merging photos.

## Lightroom

I have not yet been willing to sign up for Adobe's bloatware and high subscription prices. But I'm not ruling it out.

## Other Alternatives

I need to explore more! I _think_ other software may use Apple Photos as a base library. I'm not willing to move away from it quite yet, so it's a requirement right now.
