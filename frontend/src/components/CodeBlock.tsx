import { useMemo } from 'react';
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

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock = ({ code, language = 'javascript' }: CodeBlockProps) => {
  const html = useMemo(() => {
    console.log('CodeBlock render:', { language, availableLangs: Object.keys(Prism.languages) });
    const lang = Prism.languages[language];
    console.log('Selected lang grammar:', lang ? 'found' : 'NOT found', 'for', language);
    if (!lang) {
      console.log('Falling back to plain text');
      return code;
    }
    return Prism.highlight(code, lang, language);
  }, [code, language]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
      <pre className="text-sm">
        <code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
};
