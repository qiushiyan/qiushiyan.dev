function Blocks(blocks)
    local foundLanguage = false
    local newBlocks = pandoc.List()
    for _, block in ipairs(blocks) do
        if block.attributes and block.attributes["display-language"] then
            block.classes:insert("language-marker")
            if not foundLanguage then
                foundLanguage = true
            end
            newBlocks:insert(block)
        else
            newBlocks:insert(block)
        end
    end

    if foundLanguage then
        quarto.doc.addHtmlDependency({
            name = "language-marker",
            version = "0.0.1",
            stylesheets = {"language-marker.css"}
        })
        return newBlocks
    else
        return blocks
    end
end
