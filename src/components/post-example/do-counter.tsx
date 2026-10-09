import { CounterCard } from "./counter-card";

/** The live demo at the end of the Durable Objects intro post. */
export const DoCounterExample = () => (
  <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
    <CounterCard name="counter-1" />
    <CounterCard name="counter-2" />
  </div>
);
