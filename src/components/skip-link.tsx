import Link from "next/link";

import { MAIN_CONTENT_ID } from "@/constants";

export const SkipLink = () => {
  return (
    <Link className="skip-link" href={`#${MAIN_CONTENT_ID}`}>
      skip to main content
    </Link>
  );
};
