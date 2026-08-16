export interface Product {
    id: number;
    categoryId: number;
    categoryName: string;

    name: string;
    description: string;

    seoTitle?: string | null;
    seoDescription?: string | null;

    price: number;

    stockQuantity: number;
    lowStockThreshold: number;

    isActive: boolean;

    createdAt: string;
    updatedAt: string;

    primaryImageUrl: string | null;
}