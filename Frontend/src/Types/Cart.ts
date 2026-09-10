export type CartItem = {
    id: number;
    productId: number;
    productName: string;
    primaryImageUrl: string | null;
    unitPrice: number;
    quantity: number;
    stockQuantity: number;
    totalPrice: number;
};

export type Cart = {
    id: number | null;
    items: CartItem[];
    totalItems: number;
    subtotal: number;
};

export type AddToCartRequest = {
    productId: number;
    quantity: number;
};

export type UpdateCartItemQuantityRequest = {
    quantity: number;
};