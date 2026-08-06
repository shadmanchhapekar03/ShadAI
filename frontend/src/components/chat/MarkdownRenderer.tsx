import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/chat/CodeBlock";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose-md space-y-3 text-[15px] leading-relaxed text-text-primary [&_p]:leading-relaxed [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_h1]:mb-2 [&_h1]:mt-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_li]:leading-relaxed [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:bg-white/[0.03] [&_blockquote]:py-1 [&_blockquote]:pl-4 [&_blockquote]:text-text-secondary [&_hr]:my-4 [&_hr]:border-white/10 [&_table]:w-full [&_table]:overflow-hidden [&_table]:rounded-lg [&_table]:border [&_table]:border-white/10 [&_th]:bg-white/5 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_td]:border-t [&_td]:border-white/10 [&_td]:px-3 [&_td]:py-2 [&_tr:hover]:bg-white/[0.02]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            const child = children as React.ReactElement<{
              className?: string;
              children?: React.ReactNode;
            }>;
            const codeString = String(child.props.children ?? "").replace(/\n$/, "");
            const match = /language-(\w+)/.exec(child.props.className ?? "");
            return <CodeBlock code={codeString} language={match?.[1]} />;
          },
          code({ className, children }) {
            const match = /language-(\w+)/.exec(className ?? "");
            if (match) {
              return (
                <CodeBlock
                  code={String(children).replace(/\n$/, "")}
                  language={match[1]}
                />
              );
            }
            return <CodeBlock inline code={String(children)} />;
          },
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
