import React from 'react'
export const Button = ({ children, ghost, ...rest }) => (
    <button className={ghost ? 'btn btn-ghost' : 'btn'} {...rest}>{children}</button>
)
