import meat from '../../assets/images/meat.png';
import dairy from '../../assets/images/dairy.png';
import bakery from '../../assets/images/bakery.png';
import fruitsvegetables from '../../assets/images/Vegetables.png';

export const PRODUCTS = [
  {
    id: 'p1',
    name: 'Organic Bananas',
    price: 1.29,
    qtyLabel: '1 bunch (approx 6)',
    category: 'Fruits & Veg',
    image: fruitsvegetables,
    description: 'Fresh organic bananas, perfect for snacks and smoothies.',
  },
  {
    id: 'p2',
    name: 'Whole Milk',
    price: 3.49,
    qtyLabel: '1 Gallon',
    category: 'Dairy & Eggs',
    image: dairy,
    description: 'Rich whole milk, great for breakfast and cooking.',
  },
  {
    id: 'p3',
    name: 'Fresh Baguette',
    price: 0.89,
    qtyLabel: '1 pc',
    category: 'Bakery',
    image: bakery,
    description: 'Crispy baguette baked daily.',
  },
  {
    id: 'p4',
    name: 'Chicken Breast',
    price: 6.90,
    qtyLabel: '1 kg',
    category: 'Meat',
    image: meat,
    description: 'Lean chicken breast, perfect for healthy meals.',
  },
];
