import React from 'react';
import { useCart } from '../../hooks/useCart'; // Assuming you have a custom hook for cart management
import ProductCard from '../../components/ProductCard';
import Button from '../../components/common/Button';

const CartPage = () => {
    const { cartItems, totalAmount, removeFromCart } = useCart();

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Корзина</h1>
            {cartItems.length === 0 ? (
                <p className="text-lg">Ваша корзина пуста.</p>
            ) : (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cartItems.map(item => (
                            <ProductCard 
                                key={item.id} 
                                product={item} 
                                onRemove={() => removeFromCart(item.id)} 
                            />
                        ))}
                    </div>
                    <div className="mt-6">
                        <h2 className="text-2xl font-semibold">Итого: {totalAmount} ₽</h2>
                        <Button className="mt-4">Оформить заказ</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;