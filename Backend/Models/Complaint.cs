using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models;

public class Complaint
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int? OrderId { get; set; }

    public string TicketNumber { get; set; } = string.Empty;

    public string Subject { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Status { get; set; } = "Open";

    public string? AdminResponse { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ClosedAt { get; set; }

    public ApplicationUser User { get; set; } = null!;

    public Order? Order { get; set; }
}