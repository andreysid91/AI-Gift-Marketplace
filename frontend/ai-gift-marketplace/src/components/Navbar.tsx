import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-gray-800">
                    <Link href="/">AI Gift Marketplace</Link>
                </div>
                <div className="space-x-4">
                    <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
                    <Link href="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
                    <Link href="/cart" className="text-gray-600 hover:text-gray-900">Cart</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;