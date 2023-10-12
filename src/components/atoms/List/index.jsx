import React from 'react';

import { Ol, Ul } from './List.styles';

function List({ ordered, bullets, children, ...props }) {
  return (
    <>
      {ordered ? (
        <Ol {...props}>{children}</Ol>
      ) : (
        <Ul bullets={bullets} {...props}>
          {children}
        </Ul>
      )}
    </>
  );
}

export default List;
