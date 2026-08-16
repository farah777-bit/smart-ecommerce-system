using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models;

public class OrderStatusHistory
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int? ChangedByUserId { get; set; }

    public string PreviousStatus { get; set; } = string.Empty;

    public string NewStatus { get; set; } = string.Empty;

    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    public Order Order { get; set; } = null!;

    public ApplicationUser? ChangedByUser { get; set; }
}