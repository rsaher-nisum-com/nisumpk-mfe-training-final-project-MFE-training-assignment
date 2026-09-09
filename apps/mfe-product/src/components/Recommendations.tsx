import React from 'react';
import { Card } from '@nisum-mfe/shared-ui';
import { readBoolEnv } from '@nisum-mfe/utilities';
import type { Product } from '@nisum-mfe/shared-types';

export interface RecommendationsProps {
  products: Product[];
}

/**
 * Feature-flag demo (Bonus): gated entirely by the ENABLE_RECOMMENDATIONS
 * env var, injected at build time via webpack DefinePlugin. Toggling it in
 * .env requires no code change - a real example of config-driven behavior.
 */
export function Recommendations({ products }: RecommendationsProps) {
  if (!readBoolEnv('ENABLE_RECOMMENDATIONS') || products.length === 0) return null;

  const picks = products.slice(0, 3);

  return (
    <section style={{ marginTop: 32 }}>
      <h3>Recommended for you</h3>
      <div style={{ display: 'flex', gap: 12 }}>
        {picks.map((product) => (
          <Card key={product.id} style={{ flex: 1 }}>
            {product.name}
          </Card>
        ))}
      </div>
    </section>
  );
}
