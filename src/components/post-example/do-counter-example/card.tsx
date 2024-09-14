"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card as BaseCard,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

const API_URL = "https://counter.qiushi-yann.workers.dev";
export const Card = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const [value, setValue] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchValue = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${name}/value`);
      if (res.ok) {
        const data = (await res.json()) as { value: number };
        setError(null);
        setValue(data.value);
      } else {
        throw new Error("get value failed");
      }
    } catch (error) {
      setError("failed to fetch value");
    } finally {
      setLoading(false);
    }
  };

  const changeValue = async (action: "increment" | "decrement") => {
    const response = await fetch(`${API_URL}/${name}/${action}`, {
      method: "POST",
    });

    if (response.ok) {
      const data = (await response.json()) as { value: number };
      setError(null);
      setValue(data.value);
    } else {
      const data = await response.json();
      if (typeof data === "object" && data !== null && "retryAfter" in data) {
        toast.warning(
          `Rate limit exceeded. Please try again after ${data.retryAfter} seconds`
        );
      } else {
        console.log("failed to change value", data);
        setError("failed to change value");
      }
    }
  };

  useEffect(() => {
    fetchValue();
  }, []);

  return (
    <BaseCard
      className={cn(className, {
        "animate-pulse": loading,
      })}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-destructive">{error}</p>}
        {value !== undefined && <p>{value}</p>}
      </CardContent>
      <CardFooter className="flex items-center gap-2">
        <Button
          onClick={() => changeValue("increment")}
          size={"icon"}
          variant={"outline"}
        >
          <span className="sr-only">increment</span>
          <PlusIcon />
        </Button>
        <Button
          onClick={() => changeValue("decrement")}
          size={"icon"}
          variant={"outline"}
        >
          <span className="sr-only">decrement</span>
          <MinusIcon />
        </Button>
      </CardFooter>
    </BaseCard>
  );
};
