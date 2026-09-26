using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.OrderDTOs;

public class CreateOrderDto
{
    [Required]
    public string ShippingAddress { get; set; } = string.Empty;

    public int? CouponId { get; set; }

    [Required]
    public string PaymentMethod { get; set; } = "CashOnDelivery";
}