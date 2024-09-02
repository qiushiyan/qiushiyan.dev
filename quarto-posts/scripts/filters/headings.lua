-- Function to create a slug from a string
local function slugify(s)
    return s:lower()
        :gsub("[^%w%s-]", "") -- remove non-word chars
        :gsub("%s+", "-")     -- replace spaces with hyphens
        :gsub("^-+", "")      -- trim starting hyphens
        :gsub("-+$", "")      -- trim ending hyphens
end

-- Function to extract text from an Inlines object, preserving Markdown syntax
local function extract_text(inlines)
    local result = {}
    for _, inline in ipairs(inlines) do
        if inline.t == "Str" then
            table.insert(result, inline.text)
        elseif inline.t == "Code" then
            table.insert(result, "`" .. inline.text .. "`")
        elseif inline.t == "Emph" then
            table.insert(result, "*" .. extract_text(inline.content) .. "*")
        elseif inline.t == "Strong" then
            table.insert(result, "**" .. extract_text(inline.content) .. "**")
        elseif inline.t == "Link" then
            table.insert(result, "[" .. extract_text(inline.content) .. "](" .. inline.target .. ")")
        elseif inline.t == "Space" then
            table.insert(result, " ")
        elseif inline.t == "SoftBreak" or inline.t == "LineBreak" then
            table.insert(result, " ")
        end
        -- Add more conditions here for other inline elements as needed
    end
    return table.concat(result)
end

-- Table to store extracted headings
local headings = {}

-- Function to process headers
function Header(el)
    if el.level == 2 or el.level == 3 then
        local title = extract_text(el.content)
        local slug = slugify(pandoc.utils.stringify(el.content))
        table.insert(headings, {
            depth = el.level,
            title = title,
            slug = slug
        })

        -- Add the ID to the header
        el.attributes.id = slug
        -- Append the ID to the header content
        table.insert(el.content, pandoc.Space())
        table.insert(el.content, pandoc.Str("{#" .. slug .. "}"))
    end
    return el
end

-- Function to create table of contents comment
local function create_toc_comment()
    local toc = "BEGIN_TOC\n"
    for _, h in ipairs(headings) do
        local indent = string.rep("  ", h.depth - 2)
        toc = toc .. string.format("%s- %s|%s|%d\n", indent, h.title, h.slug, h.depth)
    end
    toc = toc .. "END_TOC"
    return pandoc.RawBlock('html', '<!--\n' .. toc .. '\n-->')
end

function Pandoc(doc)
    local toc_comment = create_toc_comment()
    table.insert(doc.blocks, 1, toc_comment)
    return doc
end
