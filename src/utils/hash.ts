export async function hashString(string: string): Promise<string> {
  return toHex(await hash(string));
}

function hash(string: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(string);

  return window.crypto.subtle.digest('SHA-512', data);
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
