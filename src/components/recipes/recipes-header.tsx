import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/lib/navigation";
import { cn, recipeViewTransitionName } from "@/lib/utils";
import { SiHtml5, SiPython } from "@icons-pack/react-simple-icons";
import { BoxIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Link } from "next-view-transitions";

type Props = {
  title: string;
  slug: string;
  group: string;
};

const iconMap = {
  python: <SiPython className="size-4 text-primary" />,
  web: <SiHtml5 className="size-4 text-primary" />,
} as Record<string, React.ReactNode | undefined>;

export const RecipesHeader = ({ title, slug, group }: Props) => {
  const icon = iconMap[group] || null;
  return (
    <header className={cn("w-full bg-background p-4")}>
      <div className="flex h-[var(--nav-height)] items-center space-x-4 sm:justify-between sm:space-x-2">
        <div className="flex items-center gap-2">
          <div className={"flex items-center gap-2"}>
            <BoxIcon className="size-6" />
            <Link
              href={routes.recipes}
              style={{ viewTransitionName: "recipes" }}
            >
              <h1 className="text-2xl font-bold">Recipes</h1>
            </Link>
          </div>
          <ChevronRightIcon className="size-6" />
          <h2
            className="flex items-center gap-2 font-sans text-xl font-bold text-accent-foreground"
            style={{
              viewTransitionName: recipeViewTransitionName(slug),
            }}
          >
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
