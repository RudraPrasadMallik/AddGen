// Pure, frontend-only text utilities, minifiers, prettifiers, encoders/decoders.

// ---- Encoders / decoders ----
export function base64Encode(input) {
  try { return btoa(unescape(encodeURIComponent(input))); }
  catch { return 'Unable to encode input.'; }
}
export function base64Decode(input) {
  try { return decodeURIComponent(escape(atob(input.trim()))); }
  catch { return 'Invalid Base64 input.'; }
}
export function urlEncode(input) { return encodeURIComponent(input); }
export function urlDecode(input) {
  try { return decodeURIComponent(input); } catch { return 'Invalid URL-encoded input.'; }
}
export function utf8Encode(input) {
  return Array.from(new TextEncoder().encode(input)).join(' ');
}
export function utf8Decode(input) {
  try {
    const bytes = input.trim().split(/\s+/).map(Number);
    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch { return 'Enter space-separated byte values.'; }
}
export function idnDecode(input) {
  try { return new URL(input.includes('://') ? input : 'http://' + input).hostname; }
  catch { return 'Enter a domain or URL.'; }
}

// ---- Escape / unescape ----
export function htmlEscape(input) {
  return input.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
export function htmlUnescape(input) {
  const el = document.createElement('textarea');
  el.innerHTML = input;
  return el.value;
}
export function jsonEscape(input) {
  return JSON.stringify(input).slice(1, -1);
}
export function jsonUnescape(input) {
  try { return JSON.parse(`"${input.replace(/^"|"$/g, '')}"`); }
  catch { return 'Invalid escaped string.'; }
}
export function stripHtml(input) {
  const el = document.createElement('div');
  el.innerHTML = input;
  return el.textContent || el.innerText || '';
}
export function extractTextFromHtml(input) { return stripHtml(input); }

// ---- Minifiers ----
export function jsonMinify(input) {
  try { return JSON.stringify(JSON.parse(input)); }
  catch { return 'Invalid JSON input.'; }
}
export function cssMinify(input) {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/\s+/g, ' ')
    .trim();
}
export function htmlMinify(input) {
  return input.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();
}
export function jsMinify(input) {
  // Lightweight: strip comments and collapse whitespace. Not a full compiler.
  return input
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\n\s*/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();
}
export function xmlMinify(input) {
  return input.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').trim();
}

// ---- Prettifiers ----
export function jsonPrettify(input) {
  try { return JSON.stringify(JSON.parse(input), null, 2); }
  catch { return 'Invalid JSON input.'; }
}
export function xmlPrettify(input) {
  try {
    const doc = new DOMParser().parseFromString(input, 'text/xml');
    if (doc.querySelector('parsererror')) return 'Invalid XML input.';
    const format = (node, indent) => {
      let out = '';
      node.childNodes.forEach((child) => {
        if (child.nodeType === 1) {
          const inner = Array.from(child.childNodes).some((c) => c.nodeType === 1);
          if (inner) out += `${indent}<${child.nodeName}>\n${format(child, indent + '  ')}${indent}</${child.nodeName}>\n`;
          else out += `${indent}<${child.nodeName}>${child.textContent}</${child.nodeName}>\n`;
        }
      });
      return out;
    };
    return format(doc, '').trim();
  } catch { return 'Invalid XML input.'; }
}
export function cssPrettify(input) {
  return input
    .replace(/\s*{\s*/g, ' {\n  ')
    .replace(/;\s*/g, ';\n  ')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}
export function htmlPrettify(input) {
  let formatted = '';
  let indent = 0;
  input.replace(/>\s*</g, '>\n<').split('\n').forEach((line) => {
    line = line.trim();
    if (!line) return;
    if (line.match(/^<\//)) indent = Math.max(0, indent - 1);
    formatted += '  '.repeat(indent) + line + '\n';
    if (line.match(/^<[^/!][^>]*[^/]>$/) && !line.match(/<\/.+>/)) indent++;
  });
  return formatted.trim();
}

// ---- Counters & text ops ----
export function wordCount(input) {
  const words = input.trim() ? input.trim().split(/\s+/).length : 0;
  return String(words);
}
export function characterCount(input) {
  return `Characters (with spaces): ${input.length}\nCharacters (no spaces): ${input.replace(/\s/g, '').length}`;
}
export function letterCount(input) {
  return String((input.match(/[a-zA-Z]/g) || []).length);
}
export function sentenceCount(input) {
  const s = input.split(/[.!?]+/).filter((x) => x.trim().length);
  return String(s.length);
}
export function lineCount(input) {
  return String(input.split(/\n/).length);
}
export function numberExtractor(input) {
  return (input.match(/-?\d+(\.\d+)?/g) || []).join('\n') || 'No numbers found.';
}

export function textRepeater(input, { times = 3 } = {}) {
  return Array(Math.max(1, times)).fill(input).join('\n');
}
export function shuffleLines(input) {
  const lines = input.split('\n');
  for (let i = lines.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lines[i], lines[j]] = [lines[j], lines[i]];
  }
  return lines.join('\n');
}
export function shuffleLetters(input) {
  return input.split('\n').map((line) => {
    const chars = line.split('');
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
  }).join('\n');
}
export function sortLines(input) {
  return input.split('\n').sort((a, b) => a.localeCompare(b)).join('\n');
}
export function textRotate(input, { by = 13 } = {}) {
  // ROT-N on letters.
  const n = ((by % 26) + 26) % 26;
  return input.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + n) % 26) + base);
  });
}
export function convertTextCase(input, { mode = 'title' } = {}) {
  switch (mode) {
    case 'upper': return input.toUpperCase();
    case 'lower': return input.toLowerCase();
    case 'sentence': return input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    case 'title': return input.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    default: return input;
  }
}
export function findAndReplace(input, { find = '', replace = '' } = {}) {
  if (!find) return input;
  return input.split(find).join(replace);
}
export function stringSplit(input, { delimiter = ',' } = {}) {
  return input.split(delimiter).join('\n');
}

// ---- URL parse ----
export function urlParse(input) {
  try {
    const u = new URL(input.trim());
    return [
      `Protocol: ${u.protocol}`,
      `Host: ${u.host}`,
      `Hostname: ${u.hostname}`,
      `Port: ${u.port || '(default)'}`,
      `Path: ${u.pathname}`,
      `Query: ${u.search || '(none)'}`,
      `Hash: ${u.hash || '(none)'}`,
    ].join('\n');
  } catch { return 'Enter a full URL, e.g. https://example.com/path?x=1'; }
}

// ---- JSON validator ----
export function jsonValidate(input) {
  try { JSON.parse(input); return 'Valid JSON.'; }
  catch (e) { return `Invalid JSON: ${e.message}`; }
}

// ---- Screen resolution (reads environment) ----
export function screenResolution() {
  const s = window.screen;
  return [
    `Screen: ${s.width} x ${s.height}`,
    `Available: ${s.availWidth} x ${s.availHeight}`,
    `Color depth: ${s.colorDepth}-bit`,
    `Device pixel ratio: ${window.devicePixelRatio}`,
    `Viewport: ${window.innerWidth} x ${window.innerHeight}`,
  ].join('\n');
}
