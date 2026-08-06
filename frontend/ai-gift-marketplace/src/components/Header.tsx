import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                <div className="text-2xl font-bold text-gray-800">
                    <Link href="/">AI Gift Marketplace</Link>
                </div>
                <nav className="space-x-4">
                    <Link href="/" className="text-lg text-gray-600 hover:text-gray-900">Home</Link>
                    <Link href="/products" className="text-lg text-gray-600 hover:text-gray-900">Products</Link>
                    <Link href="/cart" className="text-lg text-gray-600 hover:text-gray-900">Cart</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;