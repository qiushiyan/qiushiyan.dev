import yaml
import os
import re


output_files = os.getenv("QUARTO_PROJECT_OUTPUT_FILES")

class PreservedKeyDumper(yaml.SafeDumper):
    def represent_scalar(self, tag, value, style=None):
        if isinstance(value, str) and '\n' in value:
            return super().represent_scalar(tag, value, style='|')
        return super().represent_scalar(tag, value, style)

def new_content(content):
    # Extract the YAML front matter
    yaml_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not yaml_match:
        return content

    yaml_content = yaml_match.group(1)

    # Parse YAML while preserving the order
    yaml_data = yaml.safe_load(yaml_content)

    # Find the TOC block after the YAML front matter
    yaml_end = yaml_match.end()
    toc_start = content.find('<!--', yaml_end)
    if toc_start == -1:
        return content

    toc_end = content.find('-->', toc_start)
    if toc_end == -1:
        return content

    toc_content = content[toc_start+4:toc_end].strip()

    # Extract the TOC lines
    toc_lines = [line.strip() for line in toc_content.split('\n') if line.strip()]
    if len(toc_lines) < 2 or toc_lines[0] != 'BEGIN_TOC' or toc_lines[-1] != 'END_TOC':
        return content

    # Parse the TOC content
    headings = []
    for line in toc_lines[1:-1]:
        parts = line.strip().split('|')
        if len(parts) == 3:
            headings.append({
                'title': parts[0].strip('- '),
                'slug': parts[1].strip(),
                'depth': int(parts[2].strip())
            })

    # Add the headings array to the YAML data
    yaml_data['headings'] = headings

    # Update the YAML front matter in the content
    updated_yaml = yaml.dump(yaml_data, Dumper=PreservedKeyDumper, default_flow_style=False, sort_keys=False)
    updated_yaml = re.sub(r'\n\s*\n', '\n', updated_yaml)  # Remove extra newlines
    updated_content = f"---\n{updated_yaml}---\n\n"  # Ensure newline after YAML metadata

    # Append the rest of the content after the TOC block
    updated_content += content[toc_end+3:].lstrip()  # Remove leading whitespace

    return updated_content


for path in output_files.split("\n"):
    print("path", path)
    with open(path, "r+", encoding="utf-8") as f:
        content = f.read()
        updated_content = new_content(content)
        f.seek(0)
        f.write(updated_content)
        f.truncate()
