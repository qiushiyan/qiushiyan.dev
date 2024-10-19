-- Function to process headers
function Header(el)
  if el.level == 2 or el.level == 3 then
    local attr_string = ""
    for i, attr in ipairs(el.attributes) do
      if attr[1] ~= "id" or attr[1] ~= "class" then
        attr_string = attr_string .. " " .. attr[1] .. "=\"" .. attr[2] .. "\""
      end
    end

    -- Append the ID to the header content
    table.insert(el.content, pandoc.Space())
    table.insert(el.content, pandoc.Str("{#" .. el.identifier .. attr_string .. "}"))
  end
  return el
end
