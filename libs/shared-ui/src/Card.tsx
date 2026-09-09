import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...rest }: CardProps) {
  const classes = ['nisum-card', className].filter(Boolean).join(' ');
  return <div className={classes} {...rest} />;
}
