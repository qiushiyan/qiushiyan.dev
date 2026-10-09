import { CounterCard } from "./card";

/** The live demo at the end of the Durable Objects intro post. */
export const DoCounterExample = () => {
  return (
    <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
      <CounterCard name="counter-1" />
      <CounterCard name="counter-2" />
    </div>
  );
};
