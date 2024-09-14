import { cn } from "@/lib/utils";

import { IFrameClient } from "./iframe.client";

export const MyIframe = ({
  src,
  caption,
  height,
  ...props
}: React.ComponentProps<"iframe"> & {
  caption?: string;
}) => {
  return (
    <div
      className={cn("flex flex-col overflow-hidden rounded-lg border-2")}
      style={{
        height: height ? height : "85vh",
      }}
    >
      <div className="flex h-full flex-col gap-4 text-muted-foreground">
        <IFrameClient src={src} {...props} />
        {caption && (
          <div className="p-2 text-center text-sm text-muted-foreground">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
};
