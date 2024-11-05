import { Card } from "./card";

export const DoCounterExample = () => {
  return (
    <div className="my-4 grid gap-8 lg:grid-cols-2">
      <Card className="bg-primary/80" name="counter-1" />
      <Card className="bg-secondary/80" name="counter-2" />
    </div>
  );
};
