"""
The great URL filter removal.

https://www.11ty.dev/docs/filters/url/
"""

import os
import re


def replace_in_files(directories, mode="test"):
    pattern = r'({{\s*"(.*?)"\s*\|\s*url\s*}})'

    for directory in directories:
        for filename in os.listdir(directory):
            if filename.endswith(".md") or filename.endswith(".njk"):
                with open(os.path.join(directory, filename), "r") as file:
                    lines = file.readlines()

                for i, line in enumerate(lines):
                    replaced_line = line
                    for match in re.finditer(pattern, line):
                        print(f"File: {filename}, Line: {i+1}")
                        print("Before:", match.group(1))
                        print("After:", match.group(2))
                        print()
                        if mode == "replace":
                            replaced_line = replaced_line.replace(
                                match.group(1), match.group(2)
                            )

                    if mode == "replace":
                        lines[i] = replaced_line

                if mode == "replace":
                    with open(os.path.join(directory, filename), "w") as file:
                        file.writelines(lines)


directories = ["posts/garage/"]
# replace_in_files(directories, mode="test")  # for testing
replace_in_files(directories, mode="replace")  # for replacing
