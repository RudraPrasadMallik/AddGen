// Pure, frontend-only generator functions.

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBytes(n) {
  const arr = new Uint8Array(n);
  (window.crypto || window.msCrypto).getRandomValues(arr);
  return arr;
}

const LOREM_WORDS = (
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor ' +
  'incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud ' +
  'exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure ' +
  'in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint ' +
  'occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'
).split(' ');

const WORD_LIST = (
  'time person year way day thing man world life hand part child eye woman place work week ' +
  'case point government company number group problem fact apple river mountain garden window ' +
  'silver planet forest engine bridge candle pocket rocket ocean puzzle ladder anchor pillow'
).split(' ');

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---- Lorem Ipsum ----
export function loremIpsum({ count = 3, unit = 'paragraphs' } = {}) {
  const makeSentence = () => {
    const len = randInt(6, 14);
    const words = [];
    for (let i = 0; i < len; i++) words.push(pick(LOREM_WORDS));
    return capitalize(words.join(' ')) + '.';
  };
  const makeParagraph = () => {
    const n = randInt(3, 6);
    const s = [];
    for (let i = 0; i < n; i++) s.push(makeSentence());
    return s.join(' ');
  };
  if (unit === 'words') {
    const words = [];
    for (let i = 0; i < count; i++) words.push(pick(LOREM_WORDS));
    return capitalize(words.join(' ')) + '.';
  }
  if (unit === 'sentences') {
    const out = [];
    for (let i = 0; i < count; i++) out.push(makeSentence());
    return out.join(' ');
  }
  const out = [];
  for (let i = 0; i < count; i++) out.push(makeParagraph());
  return out.join('\n\n');
}

export function randomParagraphs(count = 3) {
  return loremIpsum({ count, unit: 'paragraphs' });
}
export function randomSentences(count = 5) {
  return loremIpsum({ count, unit: 'sentences' });
}
export function randomWords(count = 10) {
  const words = [];
  for (let i = 0; i < count; i++) words.push(pick(WORD_LIST));
  return words.join(' ');
}

// ---- Random characters / strings ----
export function randomCharacters({ length = 16, upper = true, lower = true, digits = true, symbols = false } = {}) {
  let pool = '';
  if (upper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lower) pool += 'abcdefghijklmnopqrstuvwxyz';
  if (digits) pool += '0123456789';
  if (symbols) pool += '!@#$%^&*()-_=+[]{};:,.<>?';
  if (!pool) pool = 'abcdefghijklmnopqrstuvwxyz';
  let out = '';
  const bytes = randomBytes(length);
  for (let i = 0; i < length; i++) out += pool[bytes[i] % pool.length];
  return out;
}

export function randomString(length = 12) {
  return randomCharacters({ length, upper: true, lower: true, digits: true, symbols: false });
}

export function randomPassword({ length = 16, upper = true, lower = true, digits = true, symbols = true } = {}) {
  return randomCharacters({ length, upper, lower, digits, symbols });
}

// ---- Numbers / bases ----
export function randomNumber({ min = 0, max = 100, count = 1 } = {}) {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  const out = [];
  for (let i = 0; i < count; i++) out.push(randInt(lo, hi));
  return out.join('\n');
}

export function randomBinary(length = 16) {
  let out = '';
  for (let i = 0; i < length; i++) out += randInt(0, 1);
  return out;
}

export function randomOctal(length = 8) {
  let out = '';
  for (let i = 0; i < length; i++) out += randInt(0, 7);
  return out;
}

export function randomHex(length = 16) {
  const hexChars = '0123456789abcdef';
  const bytes = randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) out += hexChars[bytes[i] % 16];
  return out;
}

export function randomByte(count = 8) {
  const bytes = randomBytes(count);
  return Array.from(bytes).join(', ');
}

// ---- UUID / GUID ----
export function randomUUID() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  const b = randomBytes(16);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b).map((x) => x.toString(16).padStart(2, '0'));
  return `${h.slice(0, 4).join('')}-${h.slice(4, 6).join('')}-${h.slice(6, 8).join('')}-${h.slice(8, 10).join('')}-${h.slice(10, 16).join('')}`;
}
export function randomGUID() {
  return randomUUID().toUpperCase();
}

// ---- Colors ----
export function randomColor() {
  const bytes = randomBytes(3);
  const hex = '#' + Array.from(bytes).map((x) => x.toString(16).padStart(2, '0')).join('');
  const rgb = `rgb(${bytes[0]}, ${bytes[1]}, ${bytes[2]})`;
  return `${hex}\n${rgb}`;
}

// ---- IP / MAC ----
export function randomIP() {
  return `${randInt(1, 254)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`;
}
export function randomMAC() {
  const parts = [];
  for (let i = 0; i < 6; i++) parts.push(randInt(0, 255).toString(16).padStart(2, '0'));
  return parts.join(':');
}

// ---- Credit card (Luhn-valid, FAKE test numbers only) ----
export function randomCreditCard(type = 'visa') {
  const prefixes = { visa: '4', mastercard: '5', amex: '37', discover: '6011' };
  let num = prefixes[type] || '4';
  const targetLen = type === 'amex' ? 15 : 16;
  while (num.length < targetLen - 1) num += randInt(0, 9);
  // Luhn check digit
  const digits = num.split('').map(Number);
  let sum = 0;
  let dbl = true;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits[i];
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    dbl = !dbl;
  }
  const check = (10 - (sum % 10)) % 10;
  return (num + check).replace(/(.{4})/g, '$1 ').trim();
}

// ---- Random JSON ----
export function randomJSON() {
  const obj = {
    id: randomUUID(),
    name: pick(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']),
    age: randInt(18, 70),
    active: Math.random() > 0.5,
    score: Number((Math.random() * 100).toFixed(2)),
    tags: [pick(WORD_LIST), pick(WORD_LIST)],
  };
  return JSON.stringify(obj, null, 2);
}

// ---- Random data (mixed record) ----
export function randomData(count = 5) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    rows.push({
      id: i + 1,
      uuid: randomUUID(),
      name: pick(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank']),
      email: `${pick(WORD_LIST)}${randInt(1, 99)}@example.com`,
      age: randInt(18, 70),
    });
  }
  return JSON.stringify(rows, null, 2);
}

// ---- Text from a simple regex-like charset (best-effort) ----
export function randomTextFromRegex(pattern = '[a-z]{8}') {
  // Supports patterns like [a-z]{n}, [A-Z]{n}, [0-9]{n} and concatenations.
  const re = /\[([^\]]+)\]\{(\d+)\}/g;
  let out = '';
  let m;
  let matched = false;
  while ((m = re.exec(pattern)) !== null) {
    matched = true;
    const set = expandCharClass(m[1]);
    const n = parseInt(m[2], 10);
    for (let i = 0; i < n; i++) out += pick(set);
  }
  if (!matched) return 'Unsupported pattern. Try e.g. [a-z]{8}[0-9]{4}';
  return out;
}

function expandCharClass(cls) {
  const chars = [];
  for (let i = 0; i < cls.length; i++) {
    if (cls[i + 1] === '-' && cls[i + 2]) {
      const start = cls.charCodeAt(i);
      const end = cls.charCodeAt(i + 2);
      for (let c = start; c <= end; c++) chars.push(String.fromCharCode(c));
      i += 2;
    } else {
      chars.push(cls[i]);
    }
  }
  return chars.length ? chars : ['a'];
}
