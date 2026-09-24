// Central registry of all client-side tools. Single source of truth for
// routing, the tools directory, SEO, and each tool's behavior.
//
// Each entry:
//   slug        - URL segment (/tools/<slug>)
//   name        - display name
//   category    - grouping in the directory
//   description - short SEO/description text
//   kind        - 'generate' | 'transform' | 'asyncTransform' | 'info'
//   run         - function implementing the tool
//   options     - (optional) array of option field descriptors for the UI
//   inputLabel / outputLabel / placeholder - (optional) UI text

import * as G from './lib/generators';
import * as C from './lib/converters';
import * as T from './lib/textTools';
import * as H from './lib/hashing';

export const CATEGORIES = [
  'Generators',
  'Converters',
  'Minifiers & Prettifiers',
  'Encoders & Decoders',
  'Hash Calculators',
  'Text Tools',
];

// Helper to wrap a single-arg transform so the generic UI can call run(input, options)
const tx = (fn) => (input) => fn(input);
const txOpt = (fn) => (input, opts) => fn(input, opts);

export const TOOLS = [
  // ---------------- Generators ----------------
  { slug: 'lorem-ipsum-generator', name: 'Lorem Ipsum Generator', category: 'Generators',
    description: 'Generate placeholder Lorem Ipsum paragraphs, sentences, or words for mockups and design.',
    kind: 'generate',
    options: [{ key: 'count', label: 'Count', type: 'number', default: 3, min: 1, max: 50 },
              { key: 'unit', label: 'Unit', type: 'select', default: 'paragraphs', choices: ['paragraphs', 'sentences', 'words'] }],
    run: (opts) => G.loremIpsum(opts) },
  { slug: 'random-paragraph-generator', name: 'Random Paragraph Generator', category: 'Generators',
    description: 'Generate random paragraphs of placeholder text instantly.',
    kind: 'generate',
    options: [{ key: 'count', label: 'Paragraphs', type: 'number', default: 3, min: 1, max: 30 }],
    run: (opts) => G.randomParagraphs(opts.count) },
  { slug: 'random-sentence-generator', name: 'Random Sentence Generator', category: 'Generators',
    description: 'Generate random sentences for testing and content placeholders.',
    kind: 'generate',
    options: [{ key: 'count', label: 'Sentences', type: 'number', default: 5, min: 1, max: 50 }],
    run: (opts) => G.randomSentences(opts.count) },
  { slug: 'random-word-generator', name: 'Random Word Generator', category: 'Generators',
    description: 'Generate a list of random English words.',
    kind: 'generate',
    options: [{ key: 'count', label: 'Words', type: 'number', default: 10, min: 1, max: 100 }],
    run: (opts) => G.randomWords(opts.count) },
  { slug: 'random-character-generator', name: 'Random Character Generator', category: 'Generators',
    description: 'Generate random characters with configurable character sets.',
    kind: 'generate',
    options: [{ key: 'length', label: 'Length', type: 'number', default: 16, min: 1, max: 512 },
              { key: 'upper', label: 'Uppercase', type: 'checkbox', default: true },
              { key: 'lower', label: 'Lowercase', type: 'checkbox', default: true },
              { key: 'digits', label: 'Digits', type: 'checkbox', default: true },
              { key: 'symbols', label: 'Symbols', type: 'checkbox', default: false }],
    run: (opts) => G.randomCharacters(opts) },
  { slug: 'random-string-generator', name: 'Random String Generator', category: 'Generators',
    description: 'Generate a random alphanumeric string of any length.',
    kind: 'generate',
    options: [{ key: 'length', label: 'Length', type: 'number', default: 12, min: 1, max: 512 }],
    run: (opts) => G.randomString(opts.length) },
  { slug: 'random-password-generator', name: 'Random Password Generator', category: 'Generators',
    description: 'Generate strong random passwords with letters, digits, and symbols.',
    kind: 'generate',
    options: [{ key: 'length', label: 'Length', type: 'number', default: 16, min: 4, max: 128 },
              { key: 'upper', label: 'Uppercase', type: 'checkbox', default: true },
              { key: 'lower', label: 'Lowercase', type: 'checkbox', default: true },
              { key: 'digits', label: 'Digits', type: 'checkbox', default: true },
              { key: 'symbols', label: 'Symbols', type: 'checkbox', default: true }],
    run: (opts) => G.randomPassword(opts) },
  { slug: 'random-number-generator', name: 'Random Number Generator', category: 'Generators',
    description: 'Generate random numbers within a range.',
    kind: 'generate',
    options: [{ key: 'min', label: 'Min', type: 'number', default: 0 },
              { key: 'max', label: 'Max', type: 'number', default: 100 },
              { key: 'count', label: 'How many', type: 'number', default: 1, min: 1, max: 100 }],
    run: (opts) => G.randomNumber(opts) },
  { slug: 'random-hex-generator', name: 'Random HEX Generator', category: 'Generators',
    description: 'Generate a random hexadecimal string.',
    kind: 'generate',
    options: [{ key: 'length', label: 'Length', type: 'number', default: 16, min: 1, max: 256 }],
    run: (opts) => G.randomHex(opts.length) },
  { slug: 'random-binary-generator', name: 'Random Binary Generator', category: 'Generators',
    description: 'Generate a random binary string of 0s and 1s.',
    kind: 'generate',
    options: [{ key: 'length', label: 'Bits', type: 'number', default: 16, min: 1, max: 256 }],
    run: (opts) => G.randomBinary(opts.length) },
  { slug: 'random-octal-generator', name: 'Random Octal Generator', category: 'Generators',
    description: 'Generate a random octal number string.',
    kind: 'generate',
    options: [{ key: 'length', label: 'Digits', type: 'number', default: 8, min: 1, max: 256 }],
    run: (opts) => G.randomOctal(opts.length) },
  { slug: 'random-byte-generator', name: 'Random Byte Generator', category: 'Generators',
    description: 'Generate random byte values (0-255).',
    kind: 'generate',
    options: [{ key: 'count', label: 'Bytes', type: 'number', default: 8, min: 1, max: 256 }],
    run: (opts) => G.randomByte(opts.count) },
  { slug: 'random-uuid-generator', name: 'Random UUID Generator', category: 'Generators',
    description: 'Generate a random RFC-4122 version 4 UUID.',
    kind: 'generate', run: () => G.randomUUID() },
  { slug: 'random-guid-generator', name: 'Random GUID Generator', category: 'Generators',
    description: 'Generate a random GUID (uppercase UUID).',
    kind: 'generate', run: () => G.randomGUID() },
  { slug: 'random-color-generator', name: 'Random Color Generator', category: 'Generators',
    description: 'Generate a random color in HEX and RGB.',
    kind: 'generate', run: () => G.randomColor() },
  { slug: 'random-json-generator', name: 'Random JSON Generator', category: 'Generators',
    description: 'Generate a random sample JSON object.',
    kind: 'generate', run: () => G.randomJSON() },
  { slug: 'random-data-generator', name: 'Random Data Generator', category: 'Generators',
    description: 'Generate random sample data records as JSON.',
    kind: 'generate',
    options: [{ key: 'count', label: 'Records', type: 'number', default: 5, min: 1, max: 100 }],
    run: (opts) => G.randomData(opts.count) },
  { slug: 'random-ip-generator', name: 'Random IP Generator', category: 'Generators',
    description: 'Generate a random IPv4 address.',
    kind: 'generate', run: () => G.randomIP() },
  { slug: 'random-mac-address-generator', name: 'Random MAC Address', category: 'Generators',
    description: 'Generate a random MAC address.',
    kind: 'generate', run: () => G.randomMAC() },
  { slug: 'credit-card-number-generator', name: 'Credit Card Number Generator', category: 'Generators',
    description: 'Generate Luhn-valid FAKE credit card numbers for testing only. Not real cards.',
    kind: 'generate',
    options: [{ key: 'type', label: 'Type', type: 'select', default: 'visa', choices: ['visa', 'mastercard', 'amex', 'discover'] }],
    run: (opts) => G.randomCreditCard(opts.type) },
  { slug: 'random-text-from-regex', name: 'Random Text from Regex', category: 'Generators',
    description: 'Generate random text from a simple regex-like pattern such as [a-z]{8}[0-9]{4}.',
    kind: 'transform', inputLabel: 'Pattern', placeholder: '[a-z]{8}[0-9]{4}',
    run: tx(G.randomTextFromRegex) },

  // ---------------- Converters ----------------
  { slug: 'rem-to-px-converter', name: 'REM to PX Converter', category: 'Converters', description: 'Convert rem units to pixels (base 16px).', kind: 'transform', inputLabel: 'rem value', placeholder: '1.5', run: tx(C.remToPx) },
  { slug: 'px-to-rem-converter', name: 'PX to REM Converter', category: 'Converters', description: 'Convert pixels to rem units (base 16px).', kind: 'transform', inputLabel: 'px value', placeholder: '24', run: tx(C.pxToRem) },
  { slug: 'binary-to-decimal-converter', name: 'Binary to Decimal Converter', category: 'Converters', description: 'Convert a binary number to decimal.', kind: 'transform', placeholder: '1011', run: tx(C.binaryToDecimal) },
  { slug: 'decimal-to-binary-converter', name: 'Decimal to Binary Converter', category: 'Converters', description: 'Convert a decimal number to binary.', kind: 'transform', placeholder: '42', run: tx(C.decimalToBinary) },
  { slug: 'hex-to-decimal-converter', name: 'HEX to Decimal Converter', category: 'Converters', description: 'Convert a hexadecimal number to decimal.', kind: 'transform', placeholder: '1A', run: tx(C.hexToDecimal) },
  { slug: 'decimal-to-hex-converter', name: 'Decimal to HEX Converter', category: 'Converters', description: 'Convert a decimal number to hexadecimal.', kind: 'transform', placeholder: '255', run: tx(C.decimalToHex) },
  { slug: 'oct-to-hex-converter', name: 'OCT to HEX Converter', category: 'Converters', description: 'Convert an octal number to hexadecimal.', kind: 'transform', placeholder: '17', run: tx(C.octToHex) },
  { slug: 'hex-to-bin-converter', name: 'HEX to BIN Converter', category: 'Converters', description: 'Convert a hexadecimal number to binary.', kind: 'transform', placeholder: 'FF', run: tx(C.hexToBin) },
  { slug: 'decimal-to-bcd-converter', name: 'Decimal to BCD Converter', category: 'Converters', description: 'Convert a decimal number to Binary-Coded Decimal.', kind: 'transform', placeholder: '129', run: tx(C.decimalToBCD) },
  { slug: 'bcd-to-decimal-converter', name: 'BCD to Decimal Converter', category: 'Converters', description: 'Convert Binary-Coded Decimal to a decimal number.', kind: 'transform', placeholder: '0001 0010', run: tx(C.bcdToDecimal) },
  { slug: 'decimal-to-gray-code', name: 'Decimal to Gray Code', category: 'Converters', description: 'Convert a decimal number to Gray code.', kind: 'transform', placeholder: '10', run: tx(C.decimalToGray) },
  { slug: 'gray-to-decimal', name: 'Gray Code to Decimal', category: 'Converters', description: 'Convert Gray code to a decimal number.', kind: 'transform', placeholder: '1111', run: tx(C.grayToDecimal) },
  { slug: 'decimal-to-roman-converter', name: 'Decimal to Roman Converter', category: 'Converters', description: 'Convert a number (1-3999) to Roman numerals.', kind: 'transform', placeholder: '2024', run: tx(C.decimalToRoman) },
  { slug: 'hex-to-rgb-converter', name: 'HEX to RGB Converter', category: 'Converters', description: 'Convert a HEX color to RGB.', kind: 'transform', placeholder: '#3b82f6', run: tx(C.hexToRgb) },
  { slug: 'rgb-to-hex-converter', name: 'RGB to HEX Converter', category: 'Converters', description: 'Convert an RGB color to HEX.', kind: 'transform', placeholder: '59, 130, 246', run: tx(C.rgbToHex) },
  { slug: 'json-to-xml-converter', name: 'JSON to XML Converter', category: 'Converters', description: 'Convert JSON to XML.', kind: 'transform', inputLabel: 'JSON', placeholder: '{"name":"Testovo"}', multiline: true, run: tx(C.jsonToXml) },
  { slug: 'xml-to-json-converter', name: 'XML to JSON Converter', category: 'Converters', description: 'Convert XML to JSON.', kind: 'transform', inputLabel: 'XML', placeholder: '<root><name>Testovo</name></root>', multiline: true, run: tx(C.xmlToJson) },
  { slug: 'entities-to-text-converter', name: 'Entities to Text Converter', category: 'Converters', description: 'Decode HTML entities back to plain text.', kind: 'transform', multiline: true, placeholder: '&lt;div&gt;', run: tx(C.entitiesToText) },
  { slug: 'upper-to-lowercase', name: 'Upper to Lowercase', category: 'Converters', description: 'Convert text to lowercase.', kind: 'transform', multiline: true, run: tx(C.upperToLower) },
  { slug: 'lower-to-uppercase', name: 'Lower to Uppercase', category: 'Converters', description: 'Convert text to uppercase.', kind: 'transform', multiline: true, run: tx(C.lowerToUpper) },
  { slug: 'seconds-to-hms-converter', name: 'Seconds to HMS Converter', category: 'Converters', description: 'Convert seconds to HH:MM:SS.', kind: 'transform', placeholder: '3665', run: tx(C.secondsToHms) },
  { slug: 'text-reverse-generator', name: 'Text Reverse Generator', category: 'Converters', description: 'Reverse a string of text.', kind: 'transform', multiline: true, run: tx(C.textReverse) },

  // ---------------- Minifiers & Prettifiers ----------------
  { slug: 'json-minifier', name: 'JSON Minifier', category: 'Minifiers & Prettifiers', description: 'Minify JSON by removing whitespace.', kind: 'transform', inputLabel: 'JSON', multiline: true, run: tx(T.jsonMinify) },
  { slug: 'json-prettifier', name: 'JSON Prettifier', category: 'Minifiers & Prettifiers', description: 'Prettify and format JSON with indentation.', kind: 'transform', inputLabel: 'JSON', multiline: true, run: tx(T.jsonPrettify) },
  { slug: 'css-minifier', name: 'CSS Minifier', category: 'Minifiers & Prettifiers', description: 'Minify CSS code.', kind: 'transform', inputLabel: 'CSS', multiline: true, run: tx(T.cssMinify) },
  { slug: 'css-prettifier', name: 'CSS Prettifier', category: 'Minifiers & Prettifiers', description: 'Format and beautify CSS code.', kind: 'transform', inputLabel: 'CSS', multiline: true, run: tx(T.cssPrettify) },
  { slug: 'html-minifier', name: 'HTML Minifier', category: 'Minifiers & Prettifiers', description: 'Minify HTML markup.', kind: 'transform', inputLabel: 'HTML', multiline: true, run: tx(T.htmlMinify) },
  { slug: 'html-prettifier', name: 'HTML Prettifier', category: 'Minifiers & Prettifiers', description: 'Format and indent HTML markup.', kind: 'transform', inputLabel: 'HTML', multiline: true, run: tx(T.htmlPrettify) },
  { slug: 'javascript-minifier', name: 'JavaScript Minifier', category: 'Minifiers & Prettifiers', description: 'Lightweight JavaScript minifier (removes comments and blank lines).', kind: 'transform', inputLabel: 'JavaScript', multiline: true, run: tx(T.jsMinify) },
  { slug: 'xml-minifier', name: 'XML Minifier', category: 'Minifiers & Prettifiers', description: 'Minify XML by removing whitespace and comments.', kind: 'transform', inputLabel: 'XML', multiline: true, run: tx(T.xmlMinify) },
  { slug: 'xml-prettifier', name: 'XML Prettifier', category: 'Minifiers & Prettifiers', description: 'Format and indent XML.', kind: 'transform', inputLabel: 'XML', multiline: true, run: tx(T.xmlPrettify) },

  // ---------------- Encoders & Decoders ----------------
  { slug: 'base64-encoder', name: 'Base64 Encoder', category: 'Encoders & Decoders', description: 'Encode text to Base64.', kind: 'transform', multiline: true, run: tx(T.base64Encode) },
  { slug: 'base64-decoder', name: 'Base64 Decoder', category: 'Encoders & Decoders', description: 'Decode Base64 back to text.', kind: 'transform', multiline: true, run: tx(T.base64Decode) },
  { slug: 'url-encoder', name: 'URL Encoder', category: 'Encoders & Decoders', description: 'URL-encode a string.', kind: 'transform', multiline: true, run: tx(T.urlEncode) },
  { slug: 'url-decoder', name: 'URL Decoder', category: 'Encoders & Decoders', description: 'Decode a URL-encoded string.', kind: 'transform', multiline: true, run: tx(T.urlDecode) },
  { slug: 'utf8-encoder', name: 'UTF-8 Encoder', category: 'Encoders & Decoders', description: 'Encode text to UTF-8 byte values.', kind: 'transform', multiline: true, run: tx(T.utf8Encode) },
  { slug: 'utf8-decoder', name: 'UTF-8 Decoder', category: 'Encoders & Decoders', description: 'Decode UTF-8 byte values to text.', kind: 'transform', multiline: true, placeholder: '72 105', run: tx(T.utf8Decode) },
  { slug: 'idn-decoder', name: 'IDN Decoder', category: 'Encoders & Decoders', description: 'Decode an internationalized domain name / URL host.', kind: 'transform', placeholder: 'https://example.com', run: tx(T.idnDecode) },
  { slug: 'html-escape', name: 'HTML Escape', category: 'Encoders & Decoders', description: 'Escape HTML special characters.', kind: 'transform', multiline: true, run: tx(T.htmlEscape) },
  { slug: 'html-unescape', name: 'HTML Unescape', category: 'Encoders & Decoders', description: 'Unescape HTML entities to text.', kind: 'transform', multiline: true, run: tx(T.htmlUnescape) },
  { slug: 'json-escape', name: 'JSON Escape', category: 'Encoders & Decoders', description: 'Escape a string for use inside JSON.', kind: 'transform', multiline: true, run: tx(T.jsonEscape) },
  { slug: 'json-unescape', name: 'JSON Unescape', category: 'Encoders & Decoders', description: 'Unescape a JSON-escaped string.', kind: 'transform', multiline: true, run: tx(T.jsonUnescape) },

  // ---------------- Hash Calculators ----------------
  { slug: 'md5-hash-calculator', name: 'MD5 Hash Calculator', category: 'Hash Calculators', description: 'Calculate the MD5 hash of text.', kind: 'transform', multiline: true, run: tx(H.md5) },
  { slug: 'sha1-hash-calculator', name: 'SHA1 Hash Calculator', category: 'Hash Calculators', description: 'Calculate the SHA-1 hash of text.', kind: 'asyncTransform', multiline: true, run: (i) => H.sha1(i) },
  { slug: 'sha256-hash-calculator', name: 'SHA256 Hash Calculator', category: 'Hash Calculators', description: 'Calculate the SHA-256 hash of text.', kind: 'asyncTransform', multiline: true, run: (i) => H.sha256(i) },
  { slug: 'sha384-hash-calculator', name: 'SHA384 Hash Calculator', category: 'Hash Calculators', description: 'Calculate the SHA-384 hash of text.', kind: 'asyncTransform', multiline: true, run: (i) => H.sha384(i) },
  { slug: 'sha512-hash-calculator', name: 'SHA512 Hash Calculator', category: 'Hash Calculators', description: 'Calculate the SHA-512 hash of text.', kind: 'asyncTransform', multiline: true, run: (i) => H.sha512(i) },
  { slug: 'crc32-hash-calculator', name: 'CRC32 Hash Calculator', category: 'Hash Calculators', description: 'Calculate the CRC32 checksum of text.', kind: 'transform', multiline: true, run: tx(H.crc32) },
  { slug: 'crc32b-hash-calculator', name: 'CRC32B Hash Calculator', category: 'Hash Calculators', description: 'Calculate the CRC32B checksum of text.', kind: 'transform', multiline: true, run: tx(H.crc32b) },
  { slug: 'adler32-calculator', name: 'Adler32 Calculator', category: 'Hash Calculators', description: 'Calculate the Adler-32 checksum of text.', kind: 'transform', multiline: true, run: tx(H.adler32) },

  // ---------------- Text Tools ----------------
  { slug: 'word-counter', name: 'Word Counter', category: 'Text Tools', description: 'Count the number of words in text.', kind: 'transform', multiline: true, run: tx(T.wordCount) },
  { slug: 'character-counter', name: 'Character Counter', category: 'Text Tools', description: 'Count characters with and without spaces.', kind: 'transform', multiline: true, run: tx(T.characterCount) },
  { slug: 'letter-counter', name: 'Letter Counter', category: 'Text Tools', description: 'Count the letters in text.', kind: 'transform', multiline: true, run: tx(T.letterCount) },
  { slug: 'sentence-counter', name: 'Sentence Counter', category: 'Text Tools', description: 'Count the sentences in text.', kind: 'transform', multiline: true, run: tx(T.sentenceCount) },
  { slug: 'line-counter', name: 'Line Counter', category: 'Text Tools', description: 'Count the lines in text.', kind: 'transform', multiline: true, run: tx(T.lineCount) },
  { slug: 'number-extractor', name: 'Number Extractor', category: 'Text Tools', description: 'Extract all numbers from text.', kind: 'transform', multiline: true, run: tx(T.numberExtractor) },
  { slug: 'text-repeater', name: 'Text Repeater', category: 'Text Tools', description: 'Repeat text a number of times.', kind: 'transform', multiline: true,
    options: [{ key: 'times', label: 'Times', type: 'number', default: 3, min: 1, max: 1000 }],
    run: txOpt(T.textRepeater) },
  { slug: 'shuffle-text-lines', name: 'Shuffle Text Lines', category: 'Text Tools', description: 'Randomly shuffle the lines of text.', kind: 'transform', multiline: true, run: tx(T.shuffleLines) },
  { slug: 'shuffle-letters', name: 'Shuffle Letters', category: 'Text Tools', description: 'Randomly shuffle the letters in each line.', kind: 'transform', multiline: true, run: tx(T.shuffleLetters) },
  { slug: 'sort-list', name: 'Sort List Online', category: 'Text Tools', description: 'Sort lines of text alphabetically.', kind: 'transform', multiline: true, run: tx(T.sortLines) },
  { slug: 'text-rotator', name: 'Text Rotator (ROT)', category: 'Text Tools', description: 'Rotate letters by N positions (ROT-N / ROT13).', kind: 'transform', multiline: true,
    options: [{ key: 'by', label: 'Rotate by', type: 'number', default: 13, min: 1, max: 25 }],
    run: txOpt(T.textRotate) },
  { slug: 'convert-text-case', name: 'Convert Text Case', category: 'Text Tools', description: 'Convert text to UPPER, lower, Sentence, or Title case.', kind: 'transform', multiline: true,
    options: [{ key: 'mode', label: 'Case', type: 'select', default: 'title', choices: ['title', 'sentence', 'upper', 'lower'] }],
    run: txOpt(T.convertTextCase) },
  { slug: 'find-and-replace', name: 'Find and Replace', category: 'Text Tools', description: 'Find and replace text online.', kind: 'transform', multiline: true,
    options: [{ key: 'find', label: 'Find', type: 'text', default: '' }, { key: 'replace', label: 'Replace with', type: 'text', default: '' }],
    run: txOpt(T.findAndReplace) },
  { slug: 'string-split-by-delimiter', name: 'String Split by Delimiter', category: 'Text Tools', description: 'Split a string by a delimiter into lines.', kind: 'transform', multiline: true,
    options: [{ key: 'delimiter', label: 'Delimiter', type: 'text', default: ',' }],
    run: txOpt(T.stringSplit) },
  { slug: 'strip-html', name: 'Strip HTML', category: 'Text Tools', description: 'Remove HTML tags and return plain text.', kind: 'transform', multiline: true, run: tx(T.stripHtml) },
  { slug: 'extract-text-from-html', name: 'Extract Text from HTML', category: 'Text Tools', description: 'Extract readable text from HTML.', kind: 'transform', multiline: true, run: tx(T.extractTextFromHtml) },
  { slug: 'url-parser', name: 'URL Parser', category: 'Text Tools', description: 'Parse a URL into its components.', kind: 'transform', placeholder: 'https://example.com/path?x=1', run: tx(T.urlParse) },
  { slug: 'json-validator', name: 'JSON Validator', category: 'Text Tools', description: 'Validate whether text is valid JSON.', kind: 'transform', multiline: true, run: tx(T.jsonValidate) },
  { slug: 'screen-resolution-checker', name: 'Screen Resolution Checker', category: 'Text Tools', description: 'Check your screen resolution and viewport size.', kind: 'info', run: () => T.screenResolution() },
];

// Fast lookup by slug.
export const TOOLS_BY_SLUG = TOOLS.reduce((acc, t) => { acc[t.slug] = t; return acc; }, {});

export function getToolsByCategory() {
  const map = {};
  for (const cat of CATEGORIES) map[cat] = [];
  for (const t of TOOLS) { (map[t.category] = map[t.category] || []).push(t); }
  return map;
}
