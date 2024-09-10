import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import dictionary from "dictionary-en"; // Add this import
import glob from "fast-glob";
import retextEnglish from "retext-english";
import retextIndefiniteArticle from "retext-indefinite-article";
import retextSpell from "retext-spell"; // Add this import
import retextStringify from "retext-stringify";
import { table } from "table";
import { unified } from "unified";
import { VFile } from "vfile";
import reporter from "vfile-reporter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const processor = unified()
  .use(retextEnglish)
  .use(retextIndefiniteArticle)
  .use(retextSpell, dictionary) // Add this line
  .use(retextStringify);
const postsDirectory = path.join(__dirname, "..", "content", "posts");

async function checkFiles() {
  const files = await glob(path.join(postsDirectory, "**/*.md"));
  const results = [];
  let totalErrorCount = 0;

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf-8");
    const file = path.relative(postsDirectory, filePath);
    const vfile = new VFile({ path: file, contents: content });

    try {
      const result = await processor.process(vfile);
      const errorCount = result.messages.length; // Change this line
      totalErrorCount += errorCount;
      const wordCount = content.split(/\s+/).length;

      results.push([
        file,
        wordCount,
        errorCount,
        reporter(result, { quiet: true }), // Change this line
      ]);
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }

  const tableData = [
    ["File", "Word Count", "Error Count", "Errors"],
    ...results.map(([file, wordCount, errorCount, errors]) => [
      file,
      wordCount.toString(),
      errorCount.toString(),
      errors,
    ]),
  ];

  console.log(
    table(tableData, {
      columns: {
        3: { width: 50, wrapWord: true },
      },
    })
  );

  return totalErrorCount > 0 ? 1 : 0;
}

checkFiles()
  .then((exitCode) => {
    process.exit(exitCode);
  })
  .catch((error) => {
    console.error("An error occurred:", error);
    process.exit(1);
  });
