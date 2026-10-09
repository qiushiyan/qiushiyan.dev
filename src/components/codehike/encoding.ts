/*
  Code blocks carry their source and build-time HTML in attributes of the
  content HTML. HtmlRenderer's parser (htmr) decodes attribute entities twice,
  which turns an escaped `&lt;img>` in code back into a real tag, so these
  attributes travel base64-encoded instead.
*/

const BASE64 = /^[A-Za-z0-9+/]*={0,2}$/;

/** Build time (Node). */
export const encodeAttribute = (text: string) =>
  Buffer.from(text, "utf8").toString("base64");

/**
 * Render time; `atob` and `TextDecoder` exist in Node and on Workers. A value
 * that isn't base64 (content built by an older Velite config, e.g. a dev
 * server started before a config change) is returned unchanged.
 */
export const decodeAttribute = (value: string) =>
  value.length % 4 === 0 && BASE64.test(value)
    ? new TextDecoder().decode(
        Uint8Array.from(atob(value), (char) => char.charCodeAt(0))
      )
    : value;
