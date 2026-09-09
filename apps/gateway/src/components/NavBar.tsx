import React from 'react';
import { NavLink } from 'react-router-dom';
import { Badge } from '@nisum-mfe/shared-ui';
import { selectCartTotalItems, useAppSelector } from '@nisum-mfe/state';

const linkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  fontWeight: isActive ? 700 : 400,
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
});

export function NavBar() {
  const cartCount = useAppSelector(selectCartTotalItems);

  return (
    <nav style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
      <strong style={{ marginRight: 8 }}>NISUM Shop</strong>
      <NavLink to="/" end style={linkStyle}>
        Products
      </NavLink>
      <NavLink to="/cart" style={linkStyle}>
        Cart
        <Badge count={cartCount} />
      </NavLink>
      <NavLink to="/orders" style={linkStyle}>
        Orders
      </NavLink>
    </nav>
  );
}
