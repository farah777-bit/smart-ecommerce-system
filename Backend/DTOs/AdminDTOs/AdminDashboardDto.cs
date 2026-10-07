namespace Backend.DTOs.AdminDTOs;

public class AdminDashboardDto
{
    public int TotalProducts { get; set; }

    public int TotalOrders { get; set; }

    public int TotalUsers { get; set; }

    public decimal TotalRevenue { get; set; }
}