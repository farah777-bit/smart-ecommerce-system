using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace Backend.Models;

public class Payment
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public string PaymentMethod { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string? TransactionReference { get; set; }

    public string Status { get; set; } = "Pending";

    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

    public Order Order { get; set; } = null!;
}
