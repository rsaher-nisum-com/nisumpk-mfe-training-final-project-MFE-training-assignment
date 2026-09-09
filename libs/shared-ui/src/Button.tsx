import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  const classes = ['nisum-btn', `nisum-btn--${variant}`, className].filter(Boolean).join(' ');
  return <button className={classes} {...rest} />;
}
