import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Typography components
    h1: ({ children, ...props }) => (
      <h1 
        className="text-4xl font-bold tracking-tight text-foreground mb-8 border-b border-border pb-4" 
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 
        className="text-3xl font-semibold tracking-tight text-foreground mt-12 mb-6 border-b border-border/50 pb-3" 
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 
        className="text-2xl font-semibold tracking-tight text-foreground mt-8 mb-4" 
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 
        className="text-xl font-semibold tracking-tight text-foreground mt-6 mb-3" 
        {...props}
      >
        {children}
      </h4>
    ),
    h5: ({ children, ...props }) => (
      <h5 
        className="text-lg font-semibold tracking-tight text-foreground mt-4 mb-2" 
        {...props}
      >
        {children}
      </h5>
    ),
    h6: ({ children, ...props }) => (
      <h6 
        className="text-base font-semibold tracking-tight text-foreground mt-4 mb-2" 
        {...props}
      >
        {children}
      </h6>
    ),
    
    // Paragraph and text
    p: ({ children, ...props }) => (
      <p 
        className="text-muted-foreground leading-7 mb-4" 
        {...props}
      >
        {children}
      </p>
    ),
    
    // Lists
    ul: ({ children, ...props }) => (
      <ul 
        className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground" 
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol 
        className="list-decimal pl-6 mb-4 space-y-2 text-muted-foreground" 
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li 
        className="leading-7" 
        {...props}
      >
        {children}
      </li>
    ),
    
    // Links
    a: ({ children, href, ...props }) => (
      <a 
        href={href}
        className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium transition-colors" 
        {...props}
      >
        {children}
      </a>
    ),
    
    // Code
    code: ({ children, ...props }) => (
      <code 
        className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground" 
        {...props}
      >
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre 
        className="overflow-x-auto rounded-lg bg-muted p-4 mb-4 border border-border" 
        {...props}
      >
        {children}
      </pre>
    ),
    
    // Blockquotes
    blockquote: ({ children, ...props }) => (
      <blockquote 
        className="border-l-4 border-primary pl-6 italic text-muted-foreground my-6" 
        {...props}
      >
        {children}
      </blockquote>
    ),
    
    // Tables
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto mb-4">
        <table 
          className="w-full border-collapse border border-border rounded-lg" 
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead 
        className="bg-muted" 
        {...props}
      >
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody 
        {...props}
      >
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }) => (
      <tr 
        className="border-b border-border" 
        {...props}
      >
        {children}
      </tr>
    ),
    th: ({ children, ...props }) => (
      <th 
        className="p-3 text-left font-semibold text-foreground" 
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td 
        className="p-3 text-muted-foreground" 
        {...props}
      >
        {children}
      </td>
    ),
    
    // Horizontal rule
    hr: ({ ...props }) => (
      <hr 
        className="my-8 border-t border-border" 
        {...props}
      />
    ),
    
    // Strong and emphasis
    strong: ({ children, ...props }) => (
      <strong 
        className="font-semibold text-foreground" 
        {...props}
      >
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em 
        className="italic" 
        {...props}
      >
        {children}
      </em>
    ),
    
    ...components,
  };
}
