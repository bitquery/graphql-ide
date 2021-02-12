import React from 'react';
import { DirectiveNode } from 'graphql';

export default function Directive({ directive }) {
  return (
    <span className="doc-category-item" id={directive.name.value}>
      {'@'}
      {directive.name.value}
    </span>
  );
}
