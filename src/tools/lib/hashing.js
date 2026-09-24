// Frontend-only hashing. SHA family via Web Crypto (async); MD5/CRC32/Adler32 via small JS impls.

// ---- Web Crypto SHA family (async) ----
async function subtleHash(algo, input) {
  const data = new TextEncoder().encode(input);
  const buf = await window.crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
export const sha1 = (input) => subtleHash('SHA-1', input);
export const sha256 = (input) => subtleHash('SHA-256', input);
export const sha384 = (input) => subtleHash('SHA-384', input);
export const sha512 = (input) => subtleHash('SHA-512', input);

// ---- MD5 (compact implementation) ----
export function md5(input) {
  function rotl(x, c) { return (x << c) | (x >>> (32 - c)); }
  function toBytes(str) {
    const utf8 = unescape(encodeURIComponent(str));
    const bytes = [];
    for (let i = 0; i < utf8.length; i++) bytes.push(utf8.charCodeAt(i));
    return bytes;
  }
  const msg = toBytes(input);
  const origLenBits = msg.length * 8;
  msg.push(0x80);
  while (msg.length % 64 !== 56) msg.push(0);
  for (let i = 0; i < 8; i++) { msg.push((origLenBits >>> (8 * i)) & 0xff); }

  const K = [];
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0;
  const S = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

  for (let off = 0; off < msg.length; off += 64) {
    const M = [];
    for (let i = 0; i < 16; i++) {
      M[i] = msg[off + i * 4] | (msg[off + i * 4 + 1] << 8) | (msg[off + i * 4 + 2] << 16) | (msg[off + i * 4 + 3] << 24);
    }
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F, g;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + M[g]) >>> 0;
      A = D; D = C; C = B;
      B = (B + rotl(F, S[i])) >>> 0;
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }
  const toHex = (n) => {
    let s = '';
    for (let i = 0; i < 4; i++) s += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    return s;
  };
  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}

// ---- CRC32 ----
const CRC_TABLE = (() => {
  const t = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
export function crc32(input) {
  const bytes = new TextEncoder().encode(input);
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, '0');
}
export const crc32b = crc32; // CRC32B (PHP naming) uses the same polynomial/result

// ---- Adler32 ----
export function adler32(input) {
  const bytes = new TextEncoder().encode(input);
  let a = 1, b = 0;
  const MOD = 65521;
  for (let i = 0; i < bytes.length; i++) { a = (a + bytes[i]) % MOD; b = (b + a) % MOD; }
  return (((b << 16) | a) >>> 0).toString(16).padStart(8, '0');
}
