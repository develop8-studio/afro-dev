import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';

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
        <pre>
            <code ref={ref} className={language}>
                {children}
            </code>
        </pre>
    );
};

export default CodeBlock;