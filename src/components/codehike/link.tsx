export function BlogLink(props: { href?: string; children?: React.ReactNode }) {
  if (props.href?.startsWith("hover:")) {
    const hover = props.href.slice("hover:".length);
    return (
      <span
        className="underline decoration-dotted underline-offset-4"
        data-hover={hover}
      >
        {props.children}
      </span>
    );
  }

  return <a {...props} />;
}
