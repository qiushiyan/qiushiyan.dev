import yaml
import re
import markdown
from bs4 import BeautifulSoup
import uuid


def slugify(s):
    s = s.lower()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"\s+", "-", s)
    s = re.sub(r"^-+", "", s)
    s = re.sub(r"-+$", "", s)
    return s


def replace_code_blocks(markdown_text):
    code_block_pattern = re.compile(r"(```+|~~~+).*?\n[\s\S]*?\1", re.MULTILINE)
    placeholders = {}

    def replace(match):
        placeholder = f"CODE_BLOCK_{uuid.uuid4()}"
        placeholders[placeholder] = match.group(0)
        return placeholder

    processed_text = code_block_pattern.sub(replace, markdown_text)
    return processed_text, placeholders


def restore_code_blocks(text, placeholders):
    for placeholder, code_block in placeholders.items():
        text = text.replace(placeholder, code_block)
    return text


def extract_headings(markdown_text):
    # Replace code blocks with placeholders
    processed_text, placeholders = replace_code_blocks(markdown_text)

    # Regular expression to match headings and capture custom IDs
    heading_pattern = re.compile(r"^(#{1,6})\s+(.*?)(?:\s+{#([^}]+)})?$", re.MULTILINE)

    headings = []
    for match in heading_pattern.finditer(processed_text):
        depth = len(match.group(1))
        title = match.group(2).strip()
        custom_id = match.group(3)

        if custom_id:
            slug = custom_id
        else:
            slug = slugify(title)

        headings.append(
            {
                "title": title,
                "slug": slug,
                "depth": depth,
            }
        )

    return headings


class PreservedKeyDumper(yaml.SafeDumper):
    def represent_scalar(self, tag, value, style=None):
        if isinstance(value, str) and "\n" in value:
            return super().represent_scalar(tag, value, style="|")
        return super().represent_scalar(tag, value, style)


def process_markdown(content):
    # Extract the YAML front matter
    yaml_match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
    if not yaml_match:
        return content

    yaml_content = yaml_match.group(1)

    # Parse YAML while preserving the order
    yaml_data = yaml.safe_load(yaml_content)

    # Extract headings from the markdown content after the front matter
    headings = extract_headings(content[yaml_match.end() :])

    # Add the headings array to the YAML data
    yaml_data["headings"] = headings

    # Update the YAML front matter in the content
    updated_yaml = yaml.dump(
        yaml_data, Dumper=PreservedKeyDumper, default_flow_style=False, sort_keys=False
    )
    updated_yaml = re.sub(r"\n\s*\n", "\n", updated_yaml)  # Remove extra newlines
    updated_content = (
        f"---\n{updated_yaml}---\n\n"  # Ensure newline after YAML metadata
    )

    # Append the original content after the YAML front matter
    updated_content += content[yaml_match.end() :].lstrip()  # Remove leading whitespace

    return updated_content


class PreservedKeyDumper(yaml.SafeDumper):
    def represent_scalar(self, tag, value, style=None):
        if isinstance(value, str) and "\n" in value:
            return super().represent_scalar(tag, value, style="|")
        return super().represent_scalar(tag, value, style)


def new_content(content):
    yaml_match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
    if not yaml_match:
        return content

    yaml_content = yaml_match.group(1)

    yaml_data = yaml.safe_load(yaml_content)

    headings = extract_headings(content[yaml_match.end() :])

    yaml_data["headings"] = headings

    updated_yaml = yaml.dump(
        yaml_data, Dumper=PreservedKeyDumper, default_flow_style=False, sort_keys=False
    )
    updated_yaml = re.sub(r"\n\s*\n", "\n", updated_yaml)
    updated_content = f"---\n{updated_yaml}---\n\n"

    updated_content += content[yaml_match.end() :].lstrip()

    return updated_content
