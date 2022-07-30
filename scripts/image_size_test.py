"""Re: garage/image-scroll-test-page"""

from glob import glob

from PIL import Image

paths = glob("assets/blog/slovenia/*.jpg")
out = []
for path in paths:
    with Image.open(path) as img:
        width, height = img.size

        # plan embed w/ W/H specified
        # out.append(
        #     f'<img src="/{path}" width="{width}" height="{height}" class="bare">'
        # )

        # images capped at text area
        # out.append(f'<img src="/{path}">')

        # similar to actual layout, just all single col
        out.append(
            f"""
<div class="full-width flex justify-center ph1-m ph3-l fig">
<img class="db bare novmargin" src="/{path}" style="max-height: 100vh">
</div>
        """
        )

        # images allowed to be totally full size
#         out.append(
#             f"""
# <div class="full-width flex justify-center ph1-m ph3-l fig">
# <img class="db bare novmargin" src="/{path}" width="{width}" height="{height}" style="max-width: none;">
# </div>
#         """
#         )


print("\n".join(out) + "\n")
