import os
import sys
from post_headings import new_content

sys.path.append(os.path.dirname(os.path.realpath(__file__)))


output_files = os.getenv("QUARTO_PROJECT_OUTPUT_FILES")
if output_files is None:
    print(
        "No output files found. This script must be run as the post-render script for Quarto."
    )
    sys.exit(1)


for path in output_files.split("\n"):
    print(path)
    with open(path, "r+", encoding="utf-8") as f:
        content = f.read()
        updated_content = new_content(content)
        f.seek(0)
        f.write(updated_content)
        f.truncate()
