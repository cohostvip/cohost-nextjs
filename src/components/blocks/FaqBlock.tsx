'use client';

import { useState } from 'react';
import type { ContentBlock } from '@cohostvip/cohost-node';

interface FaqBlockProps {
  block: ContentBlock;
}

export function FaqBlock({ block }: FaqBlockProps) {
  const data = block.data as {
    items?: Array<{
      id?: string;
      question: string;
      answer: string;
      order: number;
    }>;
  };

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!data.items || data.items.length === 0) {
    return null;
  }

  const sortedItems = [...data.items].sort((a, b) => a.order - b.order);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {block.title && <h2 className="text-xl font-bold text-text">{block.title}</h2>}
      <div className="space-y-3">
        {sortedItems.map((item, index) => (
          <div
            key={item.id || index}
            className="bg-surface rounded-lg border border-surface-elevated overflow-hidden"
          >
            <button
              onClick={() => toggleExpand(index)}
              className="w-full text-left p-4 hover:bg-surface-elevated transition-colors flex items-center justify-between gap-4"
            >
              <h3 className="font-semibold text-base text-text">{item.question}</h3>
              <span className="text-text-muted shrink-0 text-xl">
                {expandedIndex === index ? '−' : '+'}
              </span>
            </button>
            {expandedIndex === index && (
              <div className="px-4 pb-4">
                <p className="text-text-muted whitespace-pre-wrap p-4">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
