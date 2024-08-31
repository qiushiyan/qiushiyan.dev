import { cn } from "@/lib/utils";
import { CircleAlertIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";

interface CalloutProps extends React.ComponentProps<"div"> {
  title?: string;
  variant?: "info" | "warning";
  children: React.ReactNode;
}

const icons = {
  info: <InfoIcon className="size-8" />,
  warning: <CircleAlertIcon className="size-8" />,
};

const titles = {
  info: "Note",
  warning: "Warning",
};

export const Callout = ({
  variant = "info",
  title,
  className,
  children,
  ...props
}: CalloutProps) => {
  return (
    <div
      className={cn(
        "duration-350 relative my-4 rounded-md border p-6 leading-relaxed transition-colors",
        variant === "info" && "border-primary",
        variant === "warning" && "border-warning",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "absolute left-0 top-0 -translate-x-[calc(50%+1.5px)] -translate-y-1/2 transform rounded-full bg-background p-2 leading-[calc(1em+0.725rem)]",
          variant === "info" && "text-primary",
          variant === "warning" && "!text-warning"
        )}
      >
        {icons[variant]}
      </div>
      <strong
        className={cn(
          "mb-2 block text-[1.1em] font-bold",
          variant === "warning" && "!text-warning",
          variant === "info" && "text-primary"
        )}
      >
        {title || titles[variant]}
      </strong>
      {children}
    </div>
  );
};
