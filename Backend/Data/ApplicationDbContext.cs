using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class ApplicationDbContext :
    IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // باقي الكود كما هو

    // =========================
    // Tables
    // =========================

    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductImage> ProductImages { get; set; }

    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }

    public DbSet<Wishlist> Wishlists { get; set; }
    public DbSet<WishlistItem> WishlistItems { get; set; }

    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<OrderStatusHistory> OrderStatusHistories { get; set; }

    public DbSet<Payment> Payments { get; set; }

    public DbSet<Review> Reviews { get; set; }

    public DbSet<Coupon> Coupons { get; set; }

    public DbSet<InventoryTransaction> InventoryTransactions { get; set; }

    public DbSet<Complaint> Complaints { get; set; }

    public DbSet<ChatConversation> ChatConversations { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);


        // =====================================================
        // CATEGORY
        // Category 1 ---- N Products
        // =====================================================

        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);


        // =====================================================
        // CATEGORY SELF RELATIONSHIP
        // Parent Category 1 ---- N SubCategories
        // =====================================================

        modelBuilder.Entity<Category>()
            .HasOne(c => c.ParentCategory)
            .WithMany(c => c.SubCategories)
            .HasForeignKey(c => c.ParentCategoryId)
            .OnDelete(DeleteBehavior.Restrict);


        // =====================================================
        // PRODUCT IMAGE
        // Product 1 ---- N ProductImages
        // =====================================================

        modelBuilder.Entity<ProductImage>()
            .HasOne(pi => pi.Product)
            .WithMany(p => p.Images)
            .HasForeignKey(pi => pi.ProductId)
            .OnDelete(DeleteBehavior.Cascade);


        // =====================================================
        // CART
        // User 1 ---- 1 Cart
        // =====================================================

        modelBuilder.Entity<Cart>()
            .HasOne(c => c.User)
            .WithOne(u => u.Cart)
            .HasForeignKey<Cart>(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);


        // =====================================================
        // Cart 1 ---- N CartItems
        // =====================================================

        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Cart)
            .WithMany(c => c.Items)
            .HasForeignKey(ci => ci.CartId)
            .OnDelete(DeleteBehavior.Cascade);


        // =====================================================
        // Product 1 ---- N CartItems
        // =====================================================

        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Product)
            .WithMany(p => p.CartItems)
            .HasForeignKey(ci => ci.ProductId)
            .OnDelete(DeleteBehavior.Restrict);


        // One product only once per cart
        modelBuilder.Entity<CartItem>()
            .HasIndex(ci => new { ci.CartId, ci.ProductId })
            .IsUnique();
        // =====================================================
        // WISHLIST
        // User 1 ---- 1 Wishlist
        // =====================================================

        modelBuilder.Entity<Wishlist>()
            .HasOne(w => w.User)
            .WithOne(u => u.Wishlist)
            .HasForeignKey<Wishlist>(w => w.UserId)
            .OnDelete(DeleteBehavior.Cascade);


        // =====================================================
        // Wishlist 1 ---- N WishlistItems
        // =====================================================

        modelBuilder.Entity<WishlistItem>()
            .HasOne(wi => wi.Wishlist)
            .WithMany(w => w.Items)
            .HasForeignKey(wi => wi.WishlistId)
            .OnDelete(DeleteBehavior.Cascade);


        // =====================================================
        // Product 1 ---- N WishlistItems
        // =====================================================

        modelBuilder.Entity<WishlistItem>()
            .HasOne(wi => wi.Product)
            .WithMany(p => p.WishlistItems)
            .HasForeignKey(wi => wi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);


        // One product only once per wishlist
        modelBuilder.Entity<WishlistItem>()
            .HasIndex(wi => new { wi.WishlistId, wi.ProductId })
            .IsUnique();


        // =====================================================
        // ORDER
        // User 1 ---- N Orders
        // =====================================================

        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);


        // =====================================================
        // Order 1 ---- N OrderItems
        // =====================================================

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);


        // =====================================================
        // Product 1 ---- N OrderItems
        // =====================================================

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Product)
            .WithMany(p => p.OrderItems)
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);


        // =====================================================
        // ORDER STATUS HISTORY
        // Order 1 ---- N OrderStatusHistory
        // =====================================================

        modelBuilder.Entity<OrderStatusHistory>()
            .HasOne(osh => osh.Order)
            .WithMany(o => o.StatusHistory)
            .HasForeignKey(osh => osh.OrderId)
            .OnDelete(DeleteBehavior.Cascade);


        // =====================================================
        // PAYMENT
        // Order 1 ---- n Payment
        // =====================================================

        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Order)
            .WithMany(o => o.Payments)
            .HasForeignKey(p => p.OrderId)
            .OnDelete(DeleteBehavior.Cascade);


        // =====================================================
        // REVIEW
        // User 1 ---- N Reviews
        // =====================================================

        modelBuilder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);


        // =====================================================
        // Product 1 ---- N Reviews
        // =====================================================

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Product)
            .WithMany(p => p.Reviews)
            .HasForeignKey(r => r.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
        // User can review a product only once
        modelBuilder.Entity<Review>()
            .HasIndex(r => new { r.UserId, r.ProductId })
            .IsUnique();


        // =====================================================
        // INVENTORY TRANSACTION
        // Product 1 ---- N InventoryTransactions
        // =====================================================

        modelBuilder.Entity<InventoryTransaction>()
            .HasOne(it => it.Product)
            .WithMany(p => p.InventoryTransactions)
            .HasForeignKey(it => it.ProductId)
            .OnDelete(DeleteBehavior.Cascade);


        // =====================================================
        // User 0..1 ---- N InventoryTransactions
        // Optional User
        // =====================================================

        modelBuilder.Entity<InventoryTransaction>()
            .HasOne(it => it.User)
            .WithMany(u => u.InventoryTransactions)
            .HasForeignKey(it => it.UserId)
            .OnDelete(DeleteBehavior.SetNull);


        // =====================================================
        // COUPON
        // Coupon 1 ---- N Orders
        // =====================================================

        modelBuilder.Entity<Order>()
            .HasOne(o => o.Coupon)
            .WithMany(c => c.Orders)
            .HasForeignKey(o => o.CouponId)
            .OnDelete(DeleteBehavior.SetNull);


        // =====================================================
        // COMPLAINT
        // User 1 ---- N Complaints
        // =====================================================

        modelBuilder.Entity<Complaint>()
            .HasOne(c => c.User)
            .WithMany(u => u.Complaints)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);


        // =====================================================
        // Order 1 ---- N Complaints
        // =====================================================

        modelBuilder.Entity<Complaint>()
            .HasOne(c => c.Order)
            .WithMany(o => o.Complaints)
            .HasForeignKey(c => c.OrderId)
            .OnDelete(DeleteBehavior.Restrict);


        // =====================================================
        // CHAT
        // User 1 ---- N ChatConversations
        // =====================================================

        modelBuilder.Entity<ChatConversation>()
            .HasOne(cc => cc.User)
            .WithMany(u => u.ChatConversations)
            .HasForeignKey(cc => cc.UserId)
            .OnDelete(DeleteBehavior.Cascade);


        // =====================================================
        // ChatConversation 1 ---- N ChatMessages
        // =====================================================

        modelBuilder.Entity<ChatMessage>()
            .HasOne(cm => cm.Conversation)
            .WithMany(cc => cc.Messages)
            .HasForeignKey(cm => cm.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);


        // =====================================================
        // DECIMAL PRECISION
        // =====================================================

        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasPrecision(18, 2);



        modelBuilder.Entity<Payment>()
            .Property(p => p.Amount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(x => x.UnitPrice)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Coupon>()
            .Property(x => x.DiscountValue)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Coupon>()
            .Property(x => x.MaximumDiscountAmount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Coupon>()
            .Property(x => x.MinimumOrderAmount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .Property(x => x.DiscountAmount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .Property(x => x.ShippingCost)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .Property(x => x.Subtotal)
            .HasPrecision(18, 2);

        modelBuilder.Entity<CartItem>()
            .Property(x => x.UnitPrice)
            .HasPrecision(18, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(x => x.TotalPrice)
            .HasPrecision(18, 2);

    }
}