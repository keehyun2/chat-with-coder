import { useMemo, useState, useCallback } from 'react';
import Prism from 'prismjs';
// Base prismjs includes: markup, css, clike, javascript
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-bash';
import { useToast } from './Toast';
import { useLanguage } from '../i18n/LanguageContext';

const languageDisplayNames: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
  csharp: 'C#',
  go: 'Go',
  rust: 'Rust',
  ruby: 'Ruby',
  php: 'PHP',
  swift: 'Swift',
  kotlin: 'Kotlin',
  css: 'CSS',
  json: 'JSON',
  markdown: 'Markdown',
  bash: 'Bash',
};

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock = ({ code, language = 'javascript' }: CodeBlockProps) => {
  const { addToast } = useToast();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    const lang = Prism.languages[language];
    if (!lang) {
      return code;
    }
    return Prism.highlight(code, lang, language);
  }, [code, language]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      addToast(t('toast.copied'), 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast(t('toast.copy_failed'), 'error');
    }
  }, [code, addToast, t]);

  const displayName = languageDisplayNames[language] || language;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-700/50">
        <span className="text-xs text-gray-400 font-mono">{displayName}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-600"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm">
          <code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </div>
    </div>
  );
};
