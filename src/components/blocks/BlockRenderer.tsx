import type { ContentBlock } from '@cohostvip/cohost-node';
import { RichTextBlock } from './RichTextBlock';
import { GalleryBlock } from './GalleryBlock';
import { LocationsBlock } from './LocationsBlock';
import { FaqBlock } from './FaqBlock';

interface BlockRendererProps {
  block: ContentBlock;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'richtext':
      return <RichTextBlock block={block} />;
    case 'gallery':
      return <GalleryBlock block={block} />;
    case 'locations':
      return <LocationsBlock block={block} />;
    case 'faq':
      return <FaqBlock block={block} />;
    default:
      console.warn(`Unknown block type: ${block.type}`);
      return null;
  }
}
