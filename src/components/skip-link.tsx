import { MAIN_CONTENT_ID } from "@/constants";
import Link from "next/link";

export const SkipLink = () => {
  return (
    <Link className="skip-link" href={`#${MAIN_CONTENT_ID}`}>
      skip to main content
    </Link>
  );
};
