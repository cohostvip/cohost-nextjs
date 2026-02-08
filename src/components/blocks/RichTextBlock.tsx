import type { ContentBlock } from '@cohostvip/cohost-node';

interface RichTextBlockProps {
  block: ContentBlock;
}

export function RichTextBlock({ block }: RichTextBlockProps) {
  const data = block.data as { content?: { html?: string; text?: string } };

  if (!data.content?.html && !data.content?.text) {
    return null;
  }

  return (
    <div className="space-y-4">
      {block.title && <h2 className="text-xl font-bold text-text">{block.title}</h2>}
      {data.content.html ? (
        <div
          className="prose prose-invert max-w-none text-text-muted"
          dangerouslySetInnerHTML={{ __html: data.content.html }}
        />
      ) : (
        <p className="text-text-muted whitespace-pre-wrap">{data.content.text}</p>
      )}
    </div>
  );
}
