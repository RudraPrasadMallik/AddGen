// Pure, frontend-only converter functions. Each takes an input string, returns a string.

// ---- Units ----
export function remToPx(input) {
  const v = parseFloat(input);
  if (isNaN(v)) return 'Enter a number (rem).';
  return `${v * 16} px  (base 16px)`;
}
export function pxToRem(input) {
  const v = parseFloat(input);
  if (isNaN(v)) return 'Enter a number (px).';
  return `${v / 16} rem  (base 16px)`;
}

// ---- Number bases ----
export function binaryToDecimal(input) {
  const s = input.trim();
  if (!/^[01]+$/.test(s)) return 'Enter a binary number (0s and 1s).';
  return parseInt(s, 2).toString(10);
}
export function decimalToBinary(input) {
  const v = parseInt(input.trim(), 10);
  if (isNaN(v)) return 'Enter a decimal integer.';
  return (v >>> 0).toString(2);
}
export function hexToDecimal(input) {
  const s = input.trim().replace(/^0x/i, '');
  if (!/^[0-9a-fA-F]+$/.test(s)) return 'Enter a hexadecimal number.';
  return parseInt(s, 16).toString(10);
}
export function decimalToHex(input) {
  const v = parseInt(input.trim(), 10);
  if (isNaN(v)) return 'Enter a decimal integer.';
  return v.toString(16).toUpperCase();
}
export function octToHex(input) {
  const s = input.trim();
  if (!/^[0-7]+$/.test(s)) return 'Enter an octal number.';
  return parseInt(s, 8).toString(16).toUpperCase();
}
export function hexToBin(input) {
  const s = input.trim().replace(/^0x/i, '');
  if (!/^[0-9a-fA-F]+$/.test(s)) return 'Enter a hexadecimal number.';
  return parseInt(s, 16).toString(2);
}

// ---- BCD / Gray ----
export function decimalToBCD(input) {
  const s = input.trim();
  if (!/^\d+$/.test(s)) return 'Enter a decimal number.';
  return s.split('').map((d) => parseInt(d, 10).toString(2).padStart(4, '0')).join(' ');
}
export function bcdToDecimal(input) {
  const groups = input.trim().split(/\s+/);
  if (!groups.every((g) => /^[01]{1,4}$/.test(g))) return 'Enter BCD groups of 4 bits separated by spaces.';
  return groups.map((g) => parseInt(g, 2)).join('');
}
export function decimalToGray(input) {
  const v = parseInt(input.trim(), 10);
  if (isNaN(v)) return 'Enter a decimal integer.';
  return (v ^ (v >> 1)).toString(2);
}
export function grayToDecimal(input) {
  const s = input.trim();
  if (!/^[01]+$/.test(s)) return 'Enter a Gray code (binary).';
  let num = parseInt(s, 2);
  let mask = num >> 1;
  while (mask) { num ^= mask; mask >>= 1; }
  return num.toString(10);
}

// ---- Roman numerals ----
export function decimalToRoman(input) {
  let num = parseInt(input.trim(), 10);
  if (isNaN(num) || num <= 0 || num > 3999) return 'Enter a number between 1 and 3999.';
  const map = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
  let out = '';
  for (const [val, sym] of map) { while (num >= val) { out += sym; num -= val; } }
  return out;
}

// ---- Colors ----
export function hexToRgb(input) {
  let s = input.trim().replace(/^#/, '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return 'Enter a hex color like #3b82f6.';
  const r = parseInt(s.slice(0, 2), 16);
  const g = parseInt(s.slice(2, 4), 16);
  const b = parseInt(s.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}
export function rgbToHex(input) {
  const m = input.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (!m) return 'Enter RGB like 59, 130, 246.';
  const [r, g, b] = [m[1], m[2], m[3]].map(Number);
  if ([r, g, b].some((x) => x > 255)) return 'RGB values must be 0-255.';
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// ---- JSON <-> XML ----
export function jsonToXml(input) {
  let obj;
  try { obj = JSON.parse(input); } catch { return 'Invalid JSON input.'; }
  const toXml = (o, indent = '') => {
    if (Array.isArray(o)) return o.map((item) => `${indent}<item>\n${toXml(item, indent + '  ')}\n${indent}</item>`).join('\n');
    if (o !== null && typeof o === 'object') {
      return Object.entries(o).map(([k, v]) => {
        if (v !== null && typeof v === 'object') return `${indent}<${k}>\n${toXml(v, indent + '  ')}\n${indent}</${k}>`;
        return `${indent}<${k}>${String(v)}</${k}>`;
      }).join('\n');
    }
    return `${indent}${String(o)}`;
  };
  return `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${toXml(obj, '  ')}\n</root>`;
}
export function xmlToJson(input) {
  try {
    const doc = new DOMParser().parseFromString(input, 'text/xml');
    if (doc.querySelector('parsererror')) return 'Invalid XML input.';
    const walk = (node) => {
      const children = Array.from(node.children);
      if (!children.length) return node.textContent;
      const obj = {};
      for (const child of children) {
        const val = walk(child);
        if (obj[child.nodeName] !== undefined) {
          if (!Array.isArray(obj[child.nodeName])) obj[child.nodeName] = [obj[child.nodeName]];
          obj[child.nodeName].push(val);
        } else obj[child.nodeName] = val;
      }
      return obj;
    };
    return JSON.stringify(walk(doc.documentElement), null, 2);
  } catch { return 'Invalid XML input.'; }
}

// ---- Entities <-> text ----
export function textToEntities(input) {
  return input.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
export function entitiesToText(input) {
  const el = document.createElement('textarea');
  el.innerHTML = input;
  return el.value;
}

// ---- Case ----
export function upperToLower(input) { return input.toLowerCase(); }
export function lowerToUpper(input) { return input.toUpperCase(); }

// ---- Time ----
export function secondsToHms(input) {
  const total = parseInt(input.trim(), 10);
  if (isNaN(total) || total < 0) return 'Enter a number of seconds.';
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ---- Text reverse ----
export function textReverse(input) {
  return Array.from(input).reverse().join('');
}
