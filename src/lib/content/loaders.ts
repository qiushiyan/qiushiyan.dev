import { defineLoader } from "velite";

export const PythonScriptLoader = defineLoader({
  test: /\.py$/,
  load: async (vfile) => {
    const content = vfile.toString();

    // Regular expression to match the title block
    const titleMatch = content.match(/^"""[\s\S]*?"""/);

    let title = "";
    let code = content;

    if (titleMatch) {
      const titleBlock = titleMatch[0].replace(/^"""\s*|\s*"""$/g, "");

      // Extract title directly without YAML parsing
      const titleLine = titleBlock.match(/title:\s*(.+)/);
      if (titleLine) {
        title = titleLine[1].trim();
      }

      // Remove the title block from the code
      code = content.replace(titleMatch[0], "").trim();
    }

    return {
      data: {
        title,
        code,
        lang: "python",
      },
    };
  },
});

export const RScriptLoader = defineLoader({
  test: /\.r$/,
  load: async (vfile) => {
    return { data: { code: vfile.toString(), lang: "r" } };
  },
});
