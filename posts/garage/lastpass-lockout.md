---
title: Lastpass Lockout
date: 2023-02-06
# tags: TBD
# image: TBD
---

{% import "cards.njk" as cards %}
{{ cards.draft() }}

LastPass MFA: Too Risky

If your phone is stolen, how would you log into LastPass with multi-factor auth (MFA)?

## Circular Email Dependence

Your email is your most valuable account. All password resets and account confirmations go through your email. So, it makes sense to protect your email using a strong password, like one from LastPass, right?

When you do a new login, LastPass, by default, blocks this attempt indefinitely until you click a button in an email they send you. If you don't have access to your email, because you login to your email using LastPass, there is no way you could click this button.

So, you have to go into advanced settings and disable the feature that forces new logins through an email flow.

## Disabling Email Confirmation Also Loses You Notifications

This is a bad side effect: now I don't even get notified when I login from new locations. Using a VPN to login from different countries, while I no longer get challenged, I also don't even get notifications. This means I would have no idea if my account was compromised.

## The Grid is Broken

I enabled grid-based MFA.

How this works: the grid is a 2D array of numbers and letters generated just for you. When you try to log in, LastPass prompts you to provide four values from the grid at coordinates that they choose.

One thing I learned in my brief time writing software is that if you don't test your backup, you don't have a backup. So I tried testing the grid.

After entering the items correctly, LastPass only displays a banner that says

> Make sure your browser is accepting cookies and try again with Grid authentication.

I double checked my settings. I definintely have cookies enabled, and all of LastPass works with any other MFA option. I tried opening and closing, entering it in several times in fresh sessions.

It never once worked. I was never able to get through. It eventually just locked me out of my account for five minutes.

## What To Do? Disable MFA

Losing access to my LastPass, and hence losing access to my email, would be ruinous. I would be locked out of everything---banking, my device accounts (via Apple), the works. And as it stands, there's working MFA if you lose your devices.

I think the only option is to disable email confirmations (as above), and also disable MFA, unless you can be absolutely positive you'll never lose your devices. Since I only have two, and I'm carrying both, I don't think I can take that risk.

## No Way To Even Report The Bug

There is no way to report this to them without having them call me on a phone. When I go to their [contact page](https://support.lastpass.com/contact), there's no option to send them an email, I can only click "call me." All attempts at finding a support email on their website funnel you through this one broken flow. This is despite paying for Premium, which supposedly gives you 24/7 email support.

## Followup: Switched to OnePassword

I had these issues before all the news about the LastPass hack (TODO: link a webpage) came out, and how they were storing a bunch of your data in cleartext, and how attackers got the entire database. But, since that happened, well, yeah, good time to switch off.

I was worried about switching because some people complained about OnePassword's UX. But it is vastly superior to LastPass's UX. I have been delighted by every aspect of the product. It feels like it's made by competent developers who give a shit, and LastPass is not.
