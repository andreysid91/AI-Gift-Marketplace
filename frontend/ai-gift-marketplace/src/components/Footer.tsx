import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto text-center">
                <p className="text-lg mb-2">© {new Date().getFullYear()} AI Gift Marketplace. Все права защищены.</p>
                <div className="flex justify-center space-x-4">
                    <a href="#" className="hover:text-gray-400">Политика конфиденциальности</a>
                    <a href="#" className="hover:text-gray-400">Условия использования</a>
                    <a href="#" className="hover:text-gray-400">Контакты</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;