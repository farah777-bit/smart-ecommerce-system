using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
namespace Backend.Models
{



    public class ApplicationUser : IdentityUser<int>
    {
        public string FullName { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Cart? Cart { get; set; }

        public ICollection<Order> Orders { get; set; } = new List<Order>();

        public ICollection<Review> Reviews { get; set; } = new List<Review>();

        public Wishlist? Wishlist { get; set; }

        public ICollection<Complaint> Complaints { get; set; } = new List<Complaint>();

        public ICollection<ChatConversation> ChatConversations { get; set; } = new List<ChatConversation>();

        public ICollection<InventoryTransaction> InventoryTransactions { get; set; } = new List<InventoryTransaction>();

        public ICollection<OrderStatusHistory> OrderStatusChanges { get; set; } = new List<OrderStatusHistory>();
    }
}