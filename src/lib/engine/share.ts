/**
 * Encodes object to a URL-safe Base64 string.
 */
export function encodeBuild(data: unknown): string {
  try {
    const jsonStr = JSON.stringify(data);
    // encodeURIComponent handles non-ASCII unicode chars correctly.
    // unescape + btoa completes standard binary base64 translation.
    const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
    return base64
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch (e) {
    console.error("Failed to encode build data", e);
    return "";
  }
}

/**
 * Decodes object from a URL-safe Base64 string.
 */
export function decodeBuild(base64: string): unknown {
  if (!base64) return null;
  try {
    let str = base64.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) {
      str += "=";
    }
    const decodedStr = decodeURIComponent(escape(atob(str)));
    return JSON.parse(decodedStr);
  } catch (e) {
    console.error("Failed to decode build data", e);
    return null;
  }
}
