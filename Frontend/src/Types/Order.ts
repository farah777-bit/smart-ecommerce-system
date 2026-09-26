export type CreateOrderRequest = {
    shippingAddress: string;
    couponId: number | null;
    paymentMethod: string;
};

export type OrderItem = {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
};

export type Order = {
    id: number;
    orderNumber: string;
    orderDate: string;
    status: string;
    subtotal: number;
    discountAmount: number;
    shippingCost: number;
    totalAmount: number;
    shippingAddress: string;
    paymentStatus: string;
    paymentMethod: string;
    items: OrderItem[];
};