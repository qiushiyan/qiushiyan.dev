import { Metadata } from "next";
import Link from "next/link";
import { Block, CodeBlock, parseRoot } from "codehike/blocks";
import { highlight, Pre, RawCode } from "codehike/code";
import { z } from "zod";

import { tokenTransitions } from "@/components/codehike/token-transitions";
import { ArticleProse } from "@/components/prose-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";
// @ts-expect-error import markdown with plugin
import Content from "./content.md";
import { Selectable, Selection, SelectionProvider } from "./utils";

const Schema = Block.extend({
  intro: Block,
  steps: z.array(Block.extend({ code: CodeBlock })),
});

export const metadata: Metadata = {
  title: "QLang",
  description: "A programming language with a mix of R, Python and JavaScript",
};

export default function Page() {
  const { intro, steps } = parseRoot(Content, Schema);
  return (
    <ArticleProse>
      <article className="project">
        <div className="mb-8 flex flex-col items-center justify-center">
          <h1 className="text-balance text-4xl font-extrabold tracking-wide">
            {intro.title}
          </h1>
          <div className="flex items-center gap-6">
            <Link href={routes.home}>Home</Link>
            <Link
              href={"#demo"}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Demo
            </Link>
            <Link
              href={"https://qlang.qiushiyan.dev"}
              target="_blank"
              rel="noreferrer noopener"
              className={buttonVariants({ variant: "outline" })}
            >
              Playground
            </Link>
          </div>
        </div>
        {intro.children}
        <SelectionProvider
          className="wider mx-auto mb-[40vh] grid grid-cols-2 gap-4"
          id="demo"
        >
          <div>
            {steps.map((step, i) => (
              <Selectable
                key={i}
                index={i}
                selectOn={["click", "scroll"]}
                className="mb-24 rounded-md border px-5 py-2 text-foreground data-[selected=true]:border-primary"
              >
                <h2 className="mt-4 text-xl">{step.title}</h2>
                <div>{step.children}</div>
              </Selectable>
            ))}
          </div>
          <div className="bg-black">
            <div className="sticky top-16 overflow-auto rounded-md">
              <Selection
                from={steps.map((step) => (
                  <Code key={step.title} codeblock={step.code} />
                ))}
              />
            </div>
          </div>
        </SelectionProvider>
      </article>
    </ArticleProse>
  );
}

async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "one-dark-pro");
  return (
    <Pre
      code={highlighted}
      handlers={[tokenTransitions]}
      className="min-h-[40rem] bg-transparent"
    />
  );
}
