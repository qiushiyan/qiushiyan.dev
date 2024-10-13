function Image(el)
    local width = el.attr.attributes["width"]
    if width ~= nil then
        local width_num = tonumber(string.match(width, "%d+"))
        if width_num and width_num > 800 then
            table.insert(el.classes, "wider")
        end
    end

    return el
end
