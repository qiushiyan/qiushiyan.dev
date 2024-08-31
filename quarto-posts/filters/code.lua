function CodeBlock(el)
    local lines = {}
    for line in el.text:gmatch("[^\r\n]*\r?\n?") do
        table.insert(lines, line)
    end

    local new_lines = {}
    local block_start = -1
    local block_lines = 0
    local in_block = false

    for i, line in ipairs(lines) do
        if line:match("^#>") then
            if not in_block then
                block_start = #new_lines + 1
                in_block = true
            end
            block_lines = block_lines + 1
        elseif line:match("^%s*$") then
            -- Preserve empty lines, but don't count them in block_lines
            if in_block then
                block_lines = block_lines + 1
            end
        else
            if in_block then
                if block_lines > 6 then
                    local collapse_line
                    if block_lines >= 10 then
                        collapse_line = string.format("\n# !collapse(1:%d) collapsed\n", block_lines)
                    else
                        collapse_line = string.format("\n# !collapse(1:%d)\n", block_lines)
                    end
                    table.insert(new_lines, block_start, collapse_line)
                end
                in_block = false
                block_start = -1
                block_lines = 0
            end
        end
        table.insert(new_lines, line)
    end

    -- Handle case where block ends at the last line
    if in_block and block_lines >= 6 then
        local collapse_line
        if block_lines > 10 then
            collapse_line = string.format("# !collapse(1:%d) collapsed\n", block_lines)
        else
            collapse_line = string.format("# !collapse(1:%d)\n", block_lines)
        end
        table.insert(new_lines, block_start, collapse_line)
    end

    el.text = table.concat(new_lines, "")
    return el
end
