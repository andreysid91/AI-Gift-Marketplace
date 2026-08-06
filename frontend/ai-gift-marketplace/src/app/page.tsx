import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
    const products = [
        // Здесь можно добавить массив объектов продуктов
        {
            id: 1,
            title: 'Подарок 1',
            price: 1000,
            image: '/path/to/image1.jpg',
        },
        {
            id: 2,
            title: 'Подарок 2',
            price: 2000,
            image: '/path/to/image2.jpg',
        },
        // Добавьте больше продуктов по мере необходимости
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow p-6">
                <h1 className="text-4xl font-bold mb-6">Добро пожаловать в AI Gift Marketplace</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;