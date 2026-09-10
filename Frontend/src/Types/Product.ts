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

    averageRating: number;
    reviewsCount: number;
}

export interface ProductImage {
    id: number;
    productId: number;
    imageUrl: string;
    isPrimary: boolean;
}

export interface ProductReview {
    id: number;
    userId: number;
    userFullName: string;
    rating: number;
    comment?: string | null;
    createdAt: string;
}

export interface ProductDetails extends Product {
    images: ProductImage[];
    averageRating: number;
    reviewsCount: number;
    reviews: ProductReview[];
}