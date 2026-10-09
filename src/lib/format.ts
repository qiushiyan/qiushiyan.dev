const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  // Content dates are UTC midnight; formatting in UTC keeps prerendered
  // pages independent of the build machine's time zone.
  timeZone: "UTC",
});

/** Formats an ISO date string as "Sep 15, 2024". */
export const formatDate = (iso: string) => dateFormatter.format(new Date(iso));
