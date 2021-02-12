import React from 'react';
import TypeLink from './TypeLink';
import DefaultValue from './DefaultValue';

export default function Argument({
  arg,
  onClickType,
  showDefaultValue,
}) {
  return (
    <span className="arg">
      <span className="arg-name">{arg.name}</span>
      {': '}
      <TypeLink type={arg.type} onClick={onClickType} />
      {showDefaultValue !== false && <DefaultValue field={arg} />}
    </span>
  );
}
