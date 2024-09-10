import os
import sys

sys.path.append(os.path.dirname(os.path.realpath(__file__)))

from post_headings import new_content


output_dir = "content/posts"
post_files = os.listdir(output_dir)

for root, dirs, files in os.walk(output_dir):
    for file in files:
        if file.endswith(".md"):
            file_path = os.path.join(root, file)
            with open(file_path, "r+", encoding="utf-8") as f:
                content = f.read()
                updated_content = new_content(content)
                f.seek(0)
                f.write(updated_content)
                f.truncate()
