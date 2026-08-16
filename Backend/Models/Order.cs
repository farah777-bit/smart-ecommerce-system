using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models;

public class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int? CouponId { get; set; }

    public string OrderNumber { get; set; } = string.Empty;

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    public string Status { get; set; } = "Pending";

    public decimal Subtotal { get; set; }

    public decimal DiscountAmount { get; set; }

    public decimal ShippingCost { get; set; }

    public decimal TotalAmount { get; set; }

    public string ShippingAddress { get; set; } = string.Empty;

    public string PaymentStatus { get; set; } = "Pending";

    public ApplicationUser User { get; set; } = null!;

    public Coupon? Coupon { get; set; }

    public ICollection<OrderItem> Items { get; set; }
        = new List<OrderItem>();

    public ICollection<Payment> Payments { get; set; }
        = new List<Payment>();

    public ICollection<OrderStatusHistory> StatusHistory { get; set; }
        = new List<OrderStatusHistory>();

    public ICollection<Complaint> Complaints { get; set; }
        = new List<Complaint>();
}