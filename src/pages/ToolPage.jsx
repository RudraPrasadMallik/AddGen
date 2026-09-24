import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdContentCopy, MdRefresh, MdPlayArrow, MdArrowBack } from 'react-icons/md';
import { useSEO } from '../utils/useSEO';
import { TOOLS_BY_SLUG } from '../tools/registry';
import { getToolContent } from '../tools/toolContent';
import './ToolPage.css';

// Build the default options object from a tool's option descriptors.
function defaultOptions(tool) {
  const o = {};
  (tool.options || []).forEach((opt) => { o[opt.key] = opt.default; });
  return o;
}

function ToolPage() {
  const { slug } = useParams();
  const tool = TOOLS_BY_SLUG[slug];

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState(() => (tool ? defaultOptions(tool) : {}));
  const [busy, setBusy] = useState(false);

  // Reset state when navigating between tools.
  useEffect(() => {
    setInput('');
    setOutput('');
    setOptions(tool ? defaultOptions(tool) : {});
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useSEO(
    tool
      ? { title: tool.name, description: tool.description }
      : { title: 'Tool not found', description: 'The requested tool could not be found.' }
  );

  const runTool = useCallback(async () => {
    if (!tool) return;
    try {
      let result;
      if (tool.kind === 'generate') {
        result = tool.run(options);
      } else if (tool.kind === 'info') {
        result = tool.run();
      } else if (tool.kind === 'asyncTransform') {
        setBusy(true);
        result = await tool.run(input);
        setBusy(false);
      } else {
        // transform
        result = tool.run(input, options);
      }
      setOutput(result != null ? String(result) : '');
    } catch (err) {
      setBusy(false);
      setOutput(`Error: ${err?.message || err}`);
    }
  }, [tool, input, options]);

  // Auto-run for info tools on mount.
  useEffect(() => {
    if (tool && tool.kind === 'info') runTool();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!tool) {
    return <Navigate to="/tools" replace />;
  }

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard!');
  };

  const setOpt = (key, value) => setOptions((prev) => ({ ...prev, [key]: value }));

  const actionLabel =
    tool.kind === 'generate' ? 'Generate' :
    tool.kind === 'info' ? 'Refresh' : 'Convert';
  const ActionIcon = tool.kind === 'generate' || tool.kind === 'info' ? MdRefresh : MdPlayArrow;

  const showInput = tool.kind === 'transform' || tool.kind === 'asyncTransform';

  return (
    <main className="tool-page">
      <div className="tool-breadcrumb">
        <Link to="/tools"><MdArrowBack /> All Tools</Link>
        <span className="tool-cat-badge">{tool.category}</span>
      </div>

      <h1 className="tool-title">{tool.name}</h1>
      <p className="tool-desc">{tool.description}</p>

      {/* Options */}
      {tool.options && tool.options.length > 0 && (
        <div className="tool-options">
          {tool.options.map((opt) => (
            <div key={opt.key} className={`opt opt-${opt.type}`}>
              {opt.type === 'checkbox' ? (
                <label className="opt-checkbox">
                  <input
                    type="checkbox"
                    checked={!!options[opt.key]}
                    onChange={(e) => setOpt(opt.key, e.target.checked)}
                  />
                  <span>{opt.label}</span>
                </label>
              ) : opt.type === 'select' ? (
                <label className="opt-field">
                  <span className="opt-label">{opt.label}</span>
                  <select value={options[opt.key]} onChange={(e) => setOpt(opt.key, e.target.value)}>
                    {opt.choices.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
              ) : (
                <label className="opt-field">
                  <span className="opt-label">{opt.label}</span>
                  <input
                    type={opt.type === 'number' ? 'number' : 'text'}
                    value={options[opt.key]}
                    min={opt.min}
                    max={opt.max}
                    onChange={(e) => setOpt(opt.key, opt.type === 'number' ? Number(e.target.value) : e.target.value)}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      {showInput && (
        <div className="tool-io">
          <label className="io-label">{tool.inputLabel || 'Input'}</label>
          {tool.multiline ? (
            <textarea
              className="io-textarea"
              rows={7}
              placeholder={tool.placeholder || 'Enter text...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          ) : (
            <input
              className="io-input"
              type="text"
              placeholder={tool.placeholder || 'Enter value...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          )}
        </div>
      )}

      {/* Action */}
      <div className="tool-actions">
        <button className="tool-run-btn" onClick={runTool} disabled={busy}>
          <ActionIcon />
          <span>{busy ? 'Working…' : actionLabel}</span>
        </button>
      </div>

      {/* Output */}
      <div className="tool-io">
        <div className="io-output-head">
          <label className="io-label">Output</label>
          <button className="io-copy-btn" onClick={copyOutput} disabled={!output}>
            <MdContentCopy /> Copy
          </button>
        </div>
        <textarea
          className="io-textarea io-output"
          rows={8}
          readOnly
          placeholder="Result will appear here…"
          value={output}
        />
      </div>

      {/* Informational content */}
      <ToolContent tool={tool} />
    </main>
  );
}

// Renders the What / How / Use cases / FAQ content for a tool, plus FAQ
// structured data (JSON-LD) to help search engines show rich results.
function ToolContent({ tool }) {
  const content = getToolContent(tool);

  const faqJsonLd = content.faqs && content.faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: content.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  return (
    <section className="tool-content">
      {content.intro && content.intro.length > 0 && (
        <div className="tc-block">
          <h2>What the {tool.name} Does</h2>
          {content.intro.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      )}

      {content.howTo && content.howTo.length > 0 && (
        <div className="tc-block">
          <h2>How to Use the {tool.name}</h2>
          <ol className="tc-steps">
            {content.howTo.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>
      )}

      {content.useCases && content.useCases.length > 0 && (
        <div className="tc-block">
          <h2>Common Use Cases</h2>
          <ul className="tc-list">
            {content.useCases.map((u, i) => <li key={i}>{u}</li>)}
          </ul>
        </div>
      )}

      {content.faqs && content.faqs.length > 0 && (
        <div className="tc-block">
          <h2>Frequently Asked Questions</h2>
          <div className="tc-faqs">
            {content.faqs.map((f, i) => (
              <div key={i} className="tc-faq">
                <h3 className="tc-faq-q">{f.q}</h3>
                <p className="tc-faq-a">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
    </section>
  );
}

export default ToolPage;
