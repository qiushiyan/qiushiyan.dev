import { useCallback, useEffect, useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";



// The demo Worker from the post; it only answers requests from qiushiyan.dev (CORS).
const API_URL = "https://counter.qiushi-yann.workers.dev";

const iconButton =
  "grid size-9 place-items-center rounded-md border bg-background transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50";

type CounterResponse = { value?: number; retryAfter?: number };

const readJson = async (response: Response): Promise<CounterResponse> => {
  try {
    return (await response.json()) as CounterResponse;
  } catch {
    return {};
  }
};

/** One Durable Object counter: shows its value and sends increment/decrement requests. */
export const CounterCard = ({ name }: { name: string }) => {
  const [value, setValue] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notice, setNotice] = useState<string>();

  const fetchValue = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${name}/value`);
      const data = await readJson(response);
      if (!response.ok || typeof data.value !== "number") throw new Error();
      setValue(data.value);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [name]);

  const changeValue = async (action: "increment" | "decrement") => {
    setLoading(true);
    setNotice(undefined);
    try {
      const response = await fetch(`${API_URL}/${name}/${action}`, {
        method: "POST",
      });
      const data = await readJson(response);
      if (response.ok && typeof data.value === "number") {
        setValue(data.value);
        setError(false);
      } else if (data.retryAfter !== undefined) {
        setNotice(`Rate limited. Try again in ${data.retryAfter} seconds.`);
      } else {
        setNotice("The request failed. Try again.");
      }
    } catch {
      setNotice("The request failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching the initial value is the effect's job
    fetchValue();
  }, [fetchValue]);

  return (
    <div className="rounded-lg border bg-card text-card-foreground">
      <div className="p-6 pb-2">
        <p className="font-mono text-sm text-muted-foreground">{name}</p>
      </div>
      <div className="min-h-12 px-6">
        {error ? (
          <p className="flex items-baseline gap-2 text-sm text-muted-foreground">
            Couldn’t load the value.
            <button
              type="button"
              onClick={fetchValue}
              className="text-foreground underline decoration-current/40 underline-offset-[3px] hover:decoration-current"
            >
              Retry
            </button>
          </p>
        ) : (
          <p className="text-3xl font-semibold tabular-nums" aria-live="polite">
            {value ?? "–"}
          </p>
        )}
      </div>
      <div className="flex flex-col items-start gap-2 p-6 pt-0">
        <div className="flex gap-2">
          <button
            type="button"
            className={iconButton}
            onClick={() => changeValue("increment")}
            disabled={loading || value === undefined}
            aria-label={`Increment ${name}`}
          >
            <PlusIcon aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            className={iconButton}
            onClick={() => changeValue("decrement")}
            disabled={loading || value === undefined}
            aria-label={`Decrement ${name}`}
          >
            <MinusIcon aria-hidden className="size-4" />
          </button>
        </div>
        <p className="min-h-5 text-sm text-muted-foreground" aria-live="polite">
          {notice}
        </p>
      </div>
    </div>
  );
};
