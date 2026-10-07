using Backend.Data;
using Backend.DTOs.AdminDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<AdminDashboardDto>> GetDashboard()
    {
        var totalProducts =
            await _context.Products.CountAsync();

        var totalOrders =
            await _context.Orders.CountAsync();

        var totalUsers =
            await _context.Users.CountAsync();

        var totalRevenue =
            await _context.Orders.SumAsync(
                order => (decimal?)order.TotalAmount
            ) ?? 0;

        var dashboard = new AdminDashboardDto
        {
            TotalProducts = totalProducts,
            TotalOrders = totalOrders,
            TotalUsers = totalUsers,
            TotalRevenue = totalRevenue
        };

        return Ok(dashboard);
    }
}