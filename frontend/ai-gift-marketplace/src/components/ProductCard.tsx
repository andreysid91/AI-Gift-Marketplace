import React from 'react';
import Image from 'next/image';
import Button from './common/Button';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, imageUrl }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105">
      <Image className="w-full h-48 object-cover" src={imageUrl} alt={title} width={400} height={300} />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700 text-base mb-4">${price.toFixed(2)}</p>
        <Button label="Добавить в корзину" onClick={() => console.log(`Добавлено в корзину: ${id}`)} />
      </div>
    </div>
  );
};

export default ProductCard;