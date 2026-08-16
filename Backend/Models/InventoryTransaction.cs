using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models;

public class InventoryTransaction
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int? UserId { get; set; }

    public string TransactionType { get; set; } = string.Empty;

    public int QuantityChange { get; set; }

    public int PreviousQuantity { get; set; }

    public int NewQuantity { get; set; }

    public string? Reason { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Product Product { get; set; } = null!;

    public ApplicationUser? User { get; set; }
}