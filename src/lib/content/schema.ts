import { exec } from "child_process";
import { promisify } from "util";
import { defineSchema, s } from "velite";

const execAsync = promisify(exec);

export const timestamp = defineSchema(() =>
  s
    .custom<string | undefined>((i) => i === undefined || typeof i === "string")
    .transform<string | undefined>(async (value, { meta, addIssue }) => {
      if (value != null) {
        addIssue({
          fatal: false,
          code: "custom",
          message:
            "`s.timestamp()` schema will resolve the value from `git log -1 --format=%cd`",
        });
      }
      const { stdout } = await execAsync(
        `git log -1 --format=%cd ${meta.path}`
      );
      if (!stdout) {
        return undefined;
      }
      return new Date(stdout).toISOString();
    })
);
