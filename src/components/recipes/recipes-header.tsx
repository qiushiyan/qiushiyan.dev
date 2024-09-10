import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { SiPython } from "@icons-pack/react-simple-icons";
import { Recipe } from "#content";
import { BoxIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  title: string;
  lang: Recipe["lang"];
};

const iconMap = {
  python: <SiPython className="size-4 text-primary" />,
} as Record<string, React.ReactNode | undefined>;

export const RecipesHeader = ({ title, lang }: Props) => {
  const icon = iconMap[lang] || null;
  return (
    <header className={cn("w-full bg-background p-4")}>
      <div className="flex h-[var(--nav-height)] items-center space-x-4 sm:justify-between sm:space-x-2">
        <div className="flex items-center gap-2">
          <div className={"flex items-center gap-2"}>
            <BoxIcon className="size-6" />
            <h1
              className="text-2xl font-bold"
              style={{
                viewTransitionName: "recipes",
              }}
            >
              Recipes
            </h1>
          </div>
          <ChevronRightIcon className="size-6" />
          <h2 className="flex items-center gap-2 font-sans text-xl font-bold text-accent-foreground">
            <span>{title}</span>
            {icon}
          </h2>
        </div>
        <div className="ml-auto flex items-center justify-end space-x-4">
          <Link
            href={routes.home}
            className={cn(buttonVariants({ variant: "ghost" }), "gap-2")}
          >
            <ChevronLeftIcon className="size-4" />
            <span>Home</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};