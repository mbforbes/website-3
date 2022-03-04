---
title: Downloading books from Project Gutenberg
date: 2016-11-22
---

_Note: I wrote this in 2016, and am posting it now in 2021. Others have found it helpful. In case it's still a bit painful to download Project Gutenberg texts for NLP purposes, this guide might help you get started._

So, you want to download books from Project Gutenberg to use as text for NLP?

I had issues running [the best repo I could find](https://github.com/c-w/gutenberg) for this process. So I wrote my own brief guide. Undoubtedly the files will have changed when you read this now, but I hope it can serve as a good jumping off point.

## Step 1: Downloading

```bash
# 1. Scrape all 'en' books from a gutenberg mirror into a single
#    directory. Took 3h 25m; total size was 11G. Run on Nov 17, 2016.
#    All downloads are ".zip".
wget -m -H -nd "http://www.gutenberg.org/robot/harvest?filetypes[]=txt&langs[]=en"

# 2. Remove extra crap we get from using wget.
rm robots.txt
rm harvest*

# 3. Remove all duplicate encodings in ISO-<something> and UTF-8. Based
#    on a few random samplings it seemed like there were ASCII versions
#    of all of these. (NOTE: after trying to process the remainders, it
#    seems like many aren't actually ASCII after all. Oh well.)

ls | grep "-8.zip" | xargs rm
ls | grep "-0.zip" | xargs rm

# 4. We were then left with a handful of other files with '-' characters
#    in them (which seemed to be an indication of non-standard
#    formatting).
#     - 89-AnnexI.zip          - trade agreement doc; weird text
#     - 89-Descriptions.zip    - ""
#     - 89-Contents.zip        - ""
#     - 3290-u.zip             - unicode but with "u" instead of "0" suffix
#     - 5192-tex.zip           - tex formatted book
#     - 10681-index.zip        - thesaurus index
#     - 10681-body.zip         - thesaurus body
#     - 13526-page-inames.zip  - (I forget)
#     - 15824-h.zip            - windows-encoded file (I think)
#     - 18251-mac.zip          - mac-encoded file (I think)
#    I removed all of them
rm 89-AnnexI.zip
rm 89-Descriptions.zip
rm 89-Contents.zip
rm 3290-u.zip
rm 5192-tex.zip
rm 10681-index.zip
rm 10681-body.zip
rm 13526-page-inames.zip
rm 15824-h.zip
rm 18251-mac.zip

# 5. unzip all of the files and remove all of the zips.
sudo apt install unzip
unzip "*.zip"
rm "*.zip"

# 6. From foo.zip, some files extract directly into foo.txt, while other
#    extract into foo/foo.txt. Move all into this directory.
mv */*.txt ./

# 7. There will be empty directories left (what we want), and some
#    non-empty ones. The non-empty directories include other formats
#    (e.g. PDF), sneaky nested zips, sneaky nested zips with other
#    formats in them, at least one typo (.TXT), and possibly other things.
#    There are only 20 such directories (including several pdf/mid pairings
#    of the same serial number), so we just remove them along with the
#    empty directories.
ls | grep -v "\.txt" | xargs rm -rf


# The final size of original/ is 37,229 .txt files totaling 14G.
```

## Step 2: Cleaning

I used my fork of [c-w/Gutenberg](https://github.com/c-w/gutenberg), running `gutenberg/cleanup/strip_headers.py` to take off the inconsistent mountain of stuff above and below the books.

{% include "programming-language-tooltips.njk" %}


{% set item = collections.software | selectAttrEquals(["data", "title"], "Gutenberg") | first %}
{% include "software-long.njk" %}


You might want to check out the original repository, which has had many updates since I ran this!

Here's the rough process:

```bash
# Install the repository, setup a virtual environment.
pip install six tqdm

# Run. <indir> contains all of your downloaded .txt files. <outdir> is
# where the script dumps the (relatively) cleaned versions.
python3 clean.py <indir> <outdir>

# When I ran it, the above has encoding problems opening many of the
# files. I probably could have tried harder to fix these but believe it
# or not getting this text data has been about as fun as pulling my own
# teeth out so I decided to just let it go.
#
# What remained are 36,154 of the original 37,229 files, so about 97%
# of them.
```
