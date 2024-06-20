import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
// import 'highlight.js/styles/panda-syntax-dark.css';

interface CodeBlockProps {
    language: string;
    children: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (ref.current) {
            hljs.highlightBlock(ref.current);
        }
    }, []);

    return (
        <pre className="text-sm dark:hidden">
            <code ref={ref} className={language}>
                {children}
            </code>
        </pre>
    );
};

export default CodeBlock;