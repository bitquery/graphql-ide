import React from 'react';
import {
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';

export default function TypeLink(props) {
  const onClick = props.onClick ? props.onClick : () => null;
  return renderType(props.type, onClick);
}

function renderType(type, onClick) {
  if (type instanceof GraphQLNonNull) {
    return (
      <span>
        {renderType(type.ofType, onClick)}
        {'!'}
      </span>
    );
  }
  if (type instanceof GraphQLList) {
    return (
      <span>
        {'['}
        {renderType(type.ofType, onClick)}
        {']'}
      </span>
    );
  }
  return (
    <a
      className="type-name"
      onClick={event => {
        event.preventDefault();
        onClick(type, event);
      }}
      href="# ">
      {type?.name}
    </a>
  );
}
