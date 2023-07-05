"""
The great URL filter removal.

https://www.11ty.dev/docs/filters/url/
"""

import fnmatch
import os
import re


def replace_in_files(directories, mode="test"):
    # pattern = r'({{\s*"(.*?)"\s*\|\s*url\s*}})'  #{{ "foo" | url }} -> foo
    pattern = r"({{\s*([^|]*?)\s*\|\s*url\s*}})"  # {{ foo | url }} -> foo

    for directory in directories:
        for dirpath, dirnames, filenames in os.walk(directory):
            for filename in filenames:
                if fnmatch.fnmatch(filename, "*.md") or fnmatch.fnmatch(
                    filename, "*.njk"
                ):
                    path = os.path.join(dirpath, filename)
                    print("Checking", path)

                    with open(path, "r") as file:
                        lines = file.readlines()

                    for i, line in enumerate(lines):
                        replaced_line = line
                        for match in re.finditer(pattern, line):
                            # new = match.group(2)  # for {{ "foo" | url }} -> foo
                            new = "{{ " + match.group(2).strip() + " }}"  # -> {{ foo }}
                            print(f"File: {filename}, Line: {i+1}")
                            print("Before:", match.group(1))
                            print("After:", new)
                            print()
                            if mode == "replace":
                                replaced_line = replaced_line.replace(
                                    match.group(1), new
                                )

                        if mode == "replace":
                            lines[i] = replaced_line

                    if mode == "replace":
                        with open(path, "w") as file:
                            file.writelines(lines)


directories = ["./"]
replace_in_files(directories, mode="test")  # for testing
# replace_in_files(directories, mode="replace")  # for replacing
