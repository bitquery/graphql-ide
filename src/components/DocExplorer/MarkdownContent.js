import React from 'react';
import MD from 'markdown-it';

const md = new MD();

export default function MarkdownContent({
  markdown,
  className,
}) {
  if (!markdown) {
    return <div />;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: md.render(markdown) }}
    />
  );
}
