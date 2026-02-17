# Advanced zod tips

https://stevekinney.net/courses/full-stack-typescript/advanced-types-with-zod

- branded types

- unions and discriminated unions

- transformations `.transform` (after parse) and `preprocess` (after parse)

  - simple coercion transformation with `.coerce`
  - constrained coercion with `z.pipe` (must first be of these types first and
    then apply the coercion)

  ```ts
  const datelike = z.union([z.number(), z.string(), z.date()]);
  const datelikeToDate = datelike.pipe(z.coerce.date());

  // still works intuitively
  console.log(datelikeToDate.safeParse("2023-01-01").success); // true

  // more likely what you want
  console.log(datelikeToDate.safeParse(null).success); // false
  ```

- custom validation using `.refine` and `.custom`

```ts
function isPrime(num: number): boolean {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

const primeUnder1000Schema = z.number().int().min(2).max(999).refine(isPrime, {
  message: "Number must be prime",
});
```

```ts
const validDateString = z.custom<string>(
  (value) => {
    if (typeof value !== "string") return false;

    // Attempt to parse date
    const date = new Date(value);
    // Check if it's a real date
    return !isNaN(date.valueOf());
  },
  {
    message: "Invalid date string provided",
  }
);
```

Although you might want to use a combination of

```ts
const productSchema = z
	.object({
		price: z.number().positive(),
		quantity: z.number().int().nonnegative(),
	})
	.superRefine((data, ctx) => {
		if (data.price > 1000 && data.quantity > 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'High-value items must have quantity 0 for initial stock',
				path: ['quantity'],
			});
		}
```

- `envbool` https://x.com/colinhacks/status/1867379038744129649

- working backwards from types
  https://stevekinney.net/courses/full-stack-typescript/working-backwards-from-types-with-zod

```ts
type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
};

const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
}) satisfies z.ZodType<Task>;
```

- recursive schemas with `z.lazy`

```ts
// for recursive schemas, you have to define the type beforehand
interface Category {
	name: string;
	subcategories?: Category[]; // Recursive reference
}

const categorySchema: z.ZodSchema<Category> = z.lazy(() =>
	z.object({
		name: z.string(),
		subcategories: z.array(categorySchema).optional(), // Use lazy schema here
	}),
);


const categorySchema: z.ZodSchema<Category> = z.lazy(() =>
  z.object({
    name: z.string(),
    subcategories: z.array(categorySchema).optional(), // Use lazy schema here
  })
);
```
