using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models
{


    public class Product
    {
        public int Id { get; set; }

        public int CategoryId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string? SeoTitle { get; set; }

        public string? SeoDescription { get; set; }

        public decimal Price { get; set; }

        public int StockQuantity { get; set; }

        public int LowStockThreshold { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public Category Category { get; set; } = null!;

        public ICollection<ProductImage> Images { get; set; }
            = new List<ProductImage>();

        public ICollection<Review> Reviews { get; set; }
            = new List<Review>();

        public ICollection<CartItem> CartItems { get; set; }
            = new List<CartItem>();

        public ICollection<OrderItem> OrderItems { get; set; }
            = new List<OrderItem>();

        public ICollection<WishlistItem> WishlistItems { get; set; }
            = new List<WishlistItem>();

        public ICollection<InventoryTransaction> InventoryTransactions { get; set; }
            = new List<InventoryTransaction>();
    }
}