export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    cart: CartItem[];
}

export interface CartItem {
    productId: string;
    quantity: number;
}