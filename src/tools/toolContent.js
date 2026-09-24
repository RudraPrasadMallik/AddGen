// Per-tool informational content shown below each tool (What it does, How to
// use, Use cases, FAQ). This exists for two reasons:
//   1. It genuinely helps users understand each tool.
//   2. It gives each tool page real, unique text content — important for SEO
//      and ad-network approval (thin/empty pages rank poorly and get rejected).
//
// Structure per tool:
//   { intro: string[], howTo: string[], useCases: string[], faqs: [{q, a}] }
//
// Tools listed in TOOL_CONTENT get hand-written, unique content. Any tool not
// listed falls back to buildFallbackContent(), which composes reasonable,
// tool-specific text from the registry entry so no page is ever empty.

// ---- Hand-written content for priority / high-traffic tools ----
export const TOOL_CONTENT = {
  'random-password-generator': {
    intro: [
      'The Random Password Generator creates strong, unpredictable passwords right in your browser. You choose the length and which character sets to include — uppercase, lowercase, digits, and symbols — and it assembles a password using your device\'s cryptographic random number generator.',
      'Because generation happens locally, the password never leaves your machine and is never sent to a server or logged anywhere.',
    ],
    howTo: [
      'Set the desired password length.',
      'Toggle the character sets you want to include (uppercase, lowercase, digits, symbols).',
      'Click Generate to produce a password.',
      'Click Copy to place it on your clipboard, then paste it where you need it.',
    ],
    useCases: [
      'Creating unique passwords for new accounts instead of reusing old ones.',
      'Generating test credentials for development and QA environments.',
      'Producing API keys, tokens, or seed values that need high entropy.',
      'Rotating credentials during security reviews.',
    ],
    faqs: [
      { q: 'Are the generated passwords secure?', a: 'They are generated using the browser\'s cryptographically secure random source (Web Crypto). Longer passwords with more character sets enabled are harder to guess. For important accounts, use at least 16 characters with all sets enabled.' },
      { q: 'Is my password sent anywhere?', a: 'No. The password is created entirely in your browser. Nothing is transmitted, logged, or stored.' },
      { q: 'Should I include symbols?', a: 'Yes when the target system allows them — symbols increase entropy. Some legacy systems restrict certain characters, so disable symbols if a form rejects them.' },
    ],
  },

  'random-uuid-generator': {
    intro: [
      'This tool generates a random RFC 4122 version 4 UUID (Universally Unique Identifier) — a 128-bit value written as 32 hexadecimal digits in the familiar 8-4-4-4-12 pattern.',
      'Version 4 UUIDs are produced from random data, which makes accidental collisions astronomically unlikely, so they are widely used as identifiers that can be created independently without a central authority.',
    ],
    howTo: [
      'Click Generate to produce a new UUID v4.',
      'Click Copy to copy it to your clipboard.',
      'Generate as many as you need for your records, keys, or test fixtures.',
    ],
    useCases: [
      'Primary keys or record identifiers in databases.',
      'Correlation IDs for tracing requests across services and logs.',
      'Idempotency keys for API requests.',
      'Unique names for files, resources, or test data.',
    ],
    faqs: [
      { q: 'What is a version 4 UUID?', a: 'A UUID generated primarily from random numbers, with a few bits fixed to mark the version and variant. It does not encode time or hardware information.' },
      { q: 'Can two generated UUIDs ever collide?', a: 'In theory yes, but the probability is so small that for practical purposes v4 UUIDs are treated as unique.' },
      { q: 'What is the difference between a UUID and a GUID?', a: 'They are the same 128-bit concept. "GUID" is Microsoft\'s term and is often written in uppercase. Our GUID tool outputs the uppercase form.' },
    ],
  },

  'base64-encoder': {
    intro: [
      'The Base64 Encoder converts text into Base64 — an encoding that represents binary or text data using only 64 safe ASCII characters. This makes the data safe to embed in places that expect plain text, such as URLs, JSON, XML, or email.',
      'Encoding runs entirely in your browser; the text you enter is never uploaded.',
    ],
    howTo: [
      'Paste or type the text you want to encode.',
      'Click Convert to produce the Base64 string.',
      'Copy the result and use it wherever Base64 is required.',
    ],
    useCases: [
      'Embedding small assets or payloads inside JSON or data URLs.',
      'Encoding credentials for HTTP Basic Authorization headers.',
      'Storing binary-ish values in text-only fields or config files.',
      'Preparing test payloads for API calls.',
    ],
    faqs: [
      { q: 'Is Base64 a form of encryption?', a: 'No. Base64 is encoding, not encryption. Anyone can decode it. Do not use it to protect secrets.' },
      { q: 'Why is my Base64 output longer than the input?', a: 'Base64 represents every 3 bytes as 4 characters, so encoded output is about 33% larger than the original.' },
      { q: 'Does this handle Unicode?', a: 'Yes. The text is UTF-8 encoded before Base64 conversion, so emoji and non-Latin characters are preserved.' },
    ],
  },

  'json-prettifier': {
    intro: [
      'The JSON Prettifier formats minified or messy JSON into a clean, indented, readable structure. It parses your input, validates it, and re-serializes it with consistent two-space indentation.',
      'If the input is not valid JSON, the tool tells you instead of producing broken output — so it doubles as a quick validity check.',
    ],
    howTo: [
      'Paste your JSON (minified or unformatted) into the input.',
      'Click Convert to format it with proper indentation.',
      'Copy the prettified JSON into your code, config, or documentation.',
    ],
    useCases: [
      'Making API responses readable while debugging.',
      'Cleaning up config files before committing them.',
      'Inspecting the structure of an unfamiliar JSON payload.',
      'Preparing readable JSON examples for documentation.',
    ],
    faqs: [
      { q: 'What happens if my JSON is invalid?', a: 'The tool reports that the JSON is invalid rather than guessing. Fix the reported issue and try again.' },
      { q: 'Does prettifying change my data?', a: 'No. It only changes whitespace and formatting; the keys, values, and structure stay identical.' },
      { q: 'Can I minify instead?', a: 'Yes — use the JSON Minifier tool to strip whitespace and produce the compact form.' },
    ],
  },

  'lorem-ipsum-generator': {
    intro: [
      'The Lorem Ipsum Generator produces placeholder text for mockups, layouts, and design work. You can generate paragraphs, sentences, or words, and control how much text you need.',
      'Placeholder text lets you visualise how real content will flow through a design without waiting for the final copy.',
    ],
    howTo: [
      'Choose whether you want paragraphs, sentences, or words.',
      'Set the count.',
      'Click Generate, then copy the text into your mockup or template.',
    ],
    useCases: [
      'Filling UI mockups and wireframes with realistic-length text.',
      'Testing how a layout handles long or short content.',
      'Seeding CMS entries or templates during development.',
      'Demonstrating typography and spacing.',
    ],
    faqs: [
      { q: 'What is Lorem Ipsum?', a: 'It is scrambled Latin-like placeholder text used in publishing and design since the 1500s to focus attention on layout rather than readable content.' },
      { q: 'Can I generate just a few words?', a: 'Yes — switch the unit to "words" and set the count.' },
    ],
  },

  'md5-hash-calculator': {
    intro: [
      'The MD5 Hash Calculator computes the 128-bit MD5 digest of any text and returns it as a 32-character hexadecimal string. The same input always produces the same hash.',
      'MD5 is fast and still common for checksums and non-security fingerprints, but it is cryptographically broken and should not be used for passwords or security-sensitive verification.',
    ],
    howTo: [
      'Paste or type the text you want to hash.',
      'Click Convert to compute the MD5 digest.',
      'Copy the resulting hash.',
    ],
    useCases: [
      'Generating short fingerprints for cache keys or deduplication.',
      'Comparing file or string contents for changes (non-security).',
      'Reproducing MD5 values expected by legacy systems during testing.',
    ],
    faqs: [
      { q: 'Is MD5 safe for passwords?', a: 'No. MD5 is fast and has known collision weaknesses. Use SHA-256 or a dedicated password hash (bcrypt, Argon2) for security purposes.' },
      { q: 'Why do I always get the same hash?', a: 'Hashing is deterministic — identical input always yields the identical digest. That is what makes it useful for verification.' },
    ],
  },

  'convert-text-case': {
    intro: [
      'The Convert Text Case tool transforms text between UPPERCASE, lowercase, Sentence case, and Title Case. Paste your text, pick a mode, and get the reformatted result instantly.',
    ],
    howTo: [
      'Paste your text into the input.',
      'Choose the target case (title, sentence, upper, or lower).',
      'Click Convert and copy the result.',
    ],
    useCases: [
      'Fixing inconsistent capitalization in headings or titles.',
      'Normalizing user-entered text before storage or comparison.',
      'Preparing copy for UI labels, buttons, or documentation.',
    ],
    faqs: [
      { q: 'What is the difference between Title Case and Sentence case?', a: 'Title Case capitalizes the first letter of every word; Sentence case capitalizes only the first letter of each sentence.' },
    ],
  },
};

// ---- Fallback content generator for tools without hand-written content ----
export function buildFallbackContent(tool) {
  const name = tool.name;
  const lname = name.toLowerCase();

  const kindIntro = {
    generate: `The ${name} runs entirely in your browser and produces its result the moment you click Generate. Nothing you produce is uploaded, logged, or stored.`,
    transform: `The ${name} takes your input and returns the converted result instantly, right in your browser. Your input is processed locally and never sent to a server.`,
    asyncTransform: `The ${name} processes your input in your browser using the built-in Web Crypto API and returns the result instantly. Your input is never uploaded.`,
    info: `The ${name} reads the requested information directly from your browser and displays it instantly. Nothing is uploaded or stored.`,
  };

  const howTo = {
    generate: ['Adjust any available options to suit your needs.', 'Click Generate to produce the output.', 'Click Copy to copy the result to your clipboard.'],
    transform: ['Enter or paste your input.', 'Click Convert to process it.', 'Click Copy to copy the result.'],
    asyncTransform: ['Enter or paste your input text.', 'Click Convert to compute the result.', 'Click Copy to copy the output.'],
    info: ['The result is shown automatically.', 'Click Refresh to update it.', 'Click Copy to copy the details.'],
  };

  return {
    intro: [tool.description, kindIntro[tool.kind] || kindIntro.transform],
    howTo: howTo[tool.kind] || howTo.transform,
    useCases: [
      `Quickly ${lname.replace(/ generator| calculator| converter/g, '')} tasks during development and testing.`,
      'Generating or transforming sample data without writing throwaway scripts.',
      'Verifying behavior in QA and staging environments.',
      'Learning and experimenting without installing anything.',
    ],
    faqs: [
      { q: `Is the ${name} free to use?`, a: 'Yes. It is completely free, requires no signup, and runs entirely in your browser.' },
      { q: 'Is my data uploaded anywhere?', a: 'No. Everything is processed locally in your browser. Nothing is sent to a server, logged, or stored.' },
    ],
  };
}

export function getToolContent(tool) {
  return TOOL_CONTENT[tool.slug] || buildFallbackContent(tool);
}
