import React from 'react';

export interface BadgeProps {
  count: number;
  max?: number;
}

export function Badge({ count, max = 99 }: BadgeProps) {
  if (count <= 0) return null;
  return <span className="nisum-badge">{count > max ? `${max}+` : count}</span>;
}
