-- Function to create a slug from a string
local function slugify(s)
    return s:lower()
        :gsub("[^%w%s-]", "") -- remove non-word chars
        :gsub("%s+", "-")     -- replace spaces with hyphens
        :gsub("^-+", "")      -- trim starting hyphens
        :gsub("-+$", "")      -- trim ending hyphens
end

-- Table to store extracted headings
local headings = {}

-- Function to process headers
function Header(el)
    if el.level == 2 or el.level == 3 then
        local title = pandoc.utils.stringify(el.content)
        table.insert(headings, {
            depth = el.level,
            title = title,
            slug = slugify(title)
        })
    end
    return el
end
