import type { NextApiRequest, NextApiResponse } from 'next';

const products = [
  {
    id: 1,
    name: 'Luxury Watch',
    price: 299.99,
    image: '/images/luxury-watch.jpg',
    description: 'A luxury watch that combines elegance and functionality.',
  },
  {
    id: 2,
    name: 'Gourmet Chocolate Box',
    price: 49.99,
    image: '/images/gourmet-chocolate.jpg',
    description: 'A selection of the finest chocolates from around the world.',
  },
  {
    id: 3,
    name: 'Personalized Mug',
    price: 19.99,
    image: '/images/personalized-mug.jpg',
    description: 'A custom mug that makes every sip special.',
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(products);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}