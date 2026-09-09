import type { Product } from '@nisum-mfe/shared-types';

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Headphones',
    description: 'Over-ear headphones with active noise cancellation and 30h battery life.',
    price: 89.99,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/p1/400/300',
    stock: 24,
  },
  {
    id: 'p2',
    name: 'Mechanical Keyboard',
    description: 'Hot-swappable mechanical keyboard with warm-toned RGB backlighting.',
    price: 129.0,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/p2/400/300',
    stock: 15,
  },
  {
    id: 'p3',
    name: 'Ceramic Coffee Mug',
    description: '350ml matte-glazed mug, dishwasher and microwave safe.',
    price: 14.5,
    category: 'Home',
    image: 'https://picsum.photos/seed/p3/400/300',
    stock: 60,
  },
  {
    id: 'p4',
    name: 'Standing Desk Mat',
    description: 'Anti-fatigue mat for standing desks, 20mm cushioned foam.',
    price: 39.99,
    category: 'Home',
    image: 'https://picsum.photos/seed/p4/400/300',
    stock: 32,
  },
  {
    id: 'p5',
    name: 'Trail Running Shoes',
    description: 'Lightweight trail runners with reinforced toe cap and grippy outsole.',
    price: 74.0,
    category: 'Sportswear',
    image: 'https://picsum.photos/seed/p5/400/300',
    stock: 18,
  },
  {
    id: 'p6',
    name: 'Insulated Water Bottle',
    description: '750ml stainless steel bottle, keeps drinks cold for 24h.',
    price: 22.0,
    category: 'Sportswear',
    image: 'https://picsum.photos/seed/p6/400/300',
    stock: 45,
  },
  {
    id: 'p7',
    name: 'Notebook Set (3-pack)',
    description: 'Dot-grid A5 notebooks, 160 pages each, recycled paper.',
    price: 18.75,
    category: 'Office',
    image: 'https://picsum.photos/seed/p7/400/300',
    stock: 50,
  },
  {
    id: 'p8',
    name: 'Desk Lamp',
    description: 'Adjustable LED desk lamp with 5 brightness levels and USB charging port.',
    price: 34.5,
    category: 'Office',
    image: 'https://picsum.photos/seed/p8/400/300',
    stock: 27,
  },
];

export function findProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}
